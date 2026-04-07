'use client';

import { type FormEvent, useEffect, useState } from 'react';

type Props = {
  /** Current search text from the URL (`q`), kept in sync when the user navigates or uses back/forward. */
  queryParam: string;
  onSearch: (value: string) => void;
  disabled?: boolean;
};

export function UserSearchBar({ queryParam, onSearch, disabled }: Props) {
  const [value, setValue] = useState(queryParam);

  useEffect(() => {
    setValue(queryParam);
  }, [queryParam]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSearch(value);
  }

  function handleChange(next: string) {
    setValue(next);
    if (next === '') {
      onSearch('');
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 flex w-full max-w-3xl flex-col gap-2 sm:flex-row sm:items-center"
    >
      <label htmlFor="user-search" className="sr-only">
        Search users
      </label>
      <input
        id="user-search"
        type="search"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Search by name, role, or status"
        disabled={disabled}
        className="min-h-11 flex-1 rounded-lg border border-[#e9ecef] bg-white px-4 py-2 text-sm text-[#343a40] shadow-sm outline-none ring-zinc-400 placeholder:text-[#adb5bd] focus:ring-2 disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={disabled}
        className="min-h-11 shrink-0 rounded-lg bg-[#212529] px-5 text-sm font-medium text-white transition-colors hover:bg-[#343a40] disabled:cursor-not-allowed disabled:opacity-60"
      >
        Search
      </button>
    </form>
  );
}
