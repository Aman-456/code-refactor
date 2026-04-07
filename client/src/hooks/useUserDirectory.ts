'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { DirectoryLayout } from '@/types/directory-layout';
import type { User } from '@/types/user';

type ApiResponse = {
  success: boolean;
  data: User[];
  total: number;
  page: number;
  limit: number;
};

function apiBase(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3002';
}

function parsePage(value: string | null): number {
  const n = parseInt(value ?? '', 10);
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.floor(n);
}

function parseLimit(value: string | null): number {
  const n = parseInt(value ?? '', 10);
  if (!Number.isFinite(n) || n < 1) return 20;
  return Math.min(100, Math.max(1, Math.floor(n)));
}

function parseLayout(value: string | null): DirectoryLayout {
  return value === 'grid' ? 'grid' : 'list';
}

export function useUserDirectory() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = useMemo(
    () => parsePage(searchParams.get('page')),
    [searchParams],
  );
  const limit = useMemo(
    () => parseLimit(searchParams.get('limit')),
    [searchParams],
  );
  const q = useMemo(() => searchParams.get('q') ?? '', [searchParams]);
  const layout = useMemo(
    () => parseLayout(searchParams.get('layout')),
    [searchParams],
  );

  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const replaceQuery = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutate(params);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const normalizedUrl = useRef(false);
  useEffect(() => {
    if (normalizedUrl.current) return;
    const missingPage = searchParams.get('page') === null;
    const missingLimit = searchParams.get('limit') === null;
    if (!missingPage && !missingLimit) {
      normalizedUrl.current = true;
      return;
    }
    normalizedUrl.current = true;
    replaceQuery((params) => {
      if (searchParams.get('page') === null) params.set('page', '1');
      if (searchParams.get('limit') === null) params.set('limit', '20');
    });
  }, [replaceQuery, searchParams]);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (q) params.set('q', q);

    setLoading(true);
    setError(null);

    void (async () => {
      try {
        const res = await fetch(
          `${apiBase()}/api/users?${params.toString()}`,
          { signal: controller.signal },
        );
        if (!res.ok) {
          if (!controller.signal.aborted) {
            setError(`Request failed (${res.status})`);
          }
          return;
        }
        const json = (await res.json()) as ApiResponse;
        if (!json.success) {
          if (!controller.signal.aborted) setError('Failed to fetch data');
          return;
        }
        if (controller.signal.aborted) return;

        setUsers(json.data);
        setTotal(json.total);

        const totalPages = Math.max(1, Math.ceil(json.total / limit) || 1);
        if (json.total > 0 && page > totalPages) {
          replaceQuery((p) => {
            p.set('page', String(totalPages));
          });
        }
      } catch {
        if (!controller.signal.aborted) {
          setError('Network connection failed');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [limit, page, q, replaceQuery]);

  const applySearch = useCallback(
    (value: string) => {
      replaceQuery((params) => {
        const trimmed = value.trim();
        if (trimmed) params.set('q', trimmed);
        else params.delete('q');
        params.set('page', '1');
      });
    },
    [replaceQuery],
  );

  const goToPage = useCallback(
    (nextPage: number) => {
      const safe = Math.max(1, Math.floor(nextPage));
      replaceQuery((params) => {
        params.set('page', String(safe));
      });
    },
    [replaceQuery],
  );

  const setLimit = useCallback(
    (nextLimit: number) => {
      const clamped = Math.min(100, Math.max(1, Math.floor(nextLimit)));
      replaceQuery((params) => {
        params.set('limit', String(clamped));
        params.set('page', '1');
      });
    },
    [replaceQuery],
  );

  const setLayout = useCallback(
    (next: DirectoryLayout) => {
      replaceQuery((params) => {
        if (next === 'list') params.delete('layout');
        else params.set('layout', 'grid');
      });
    },
    [replaceQuery],
  );

  return {
    users,
    total,
    page,
    limit,
    q,
    layout,
    loading,
    error,
    applySearch,
    goToPage,
    setLimit,
    setLayout,
  };
}
