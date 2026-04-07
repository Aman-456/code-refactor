'use client';

import type { DirectoryLayout } from '@/types/directory-layout';
import type { User } from '@/types/user';

type Props = {
  user: User;
  variant?: DirectoryLayout;
};

export function UserCard({ user, variant = 'list' }: Props) {
  const active = user.status === 'Active';
  const isGrid = variant === 'grid';

  return (
    <button
      type="button"
      onClick={() => {
        window.alert(`User Clicked: ${user.name}`);
      }}
      className={`w-full cursor-pointer rounded-lg border border-[#e9ecef] bg-white text-left shadow-[0_2px_4px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400 ${
        isGrid ? 'flex h-full min-h-[140px] flex-col p-4' : 'p-5'
      }`}
    >
      <div
        className={
          isGrid
            ? 'mb-2 flex flex-1 flex-row items-start justify-between gap-2'
            : 'mb-3 flex items-center justify-between gap-3'
        }
      >
        <h2
          className={`m-0 min-w-0 flex-1 font-semibold text-[#343a40] ${
            isGrid ? 'line-clamp-2 text-base leading-snug' : 'text-lg'
          }`}
        >
          {user.name}
        </h2>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
            active
              ? 'bg-[#d4edda] text-[#155724]'
              : 'bg-[#f8d7da] text-[#721c24]'
          }`}
        >
          {user.status}
        </span>
      </div>
      <div
        className={
          isGrid
            ? 'mt-auto flex flex-col gap-1 border-t border-[#f1f3f5] pt-2'
            : 'flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between'
        }
      >
        <p className="m-0 text-sm font-medium text-[#6c757d]">Role: {user.role}</p>
        <p className="m-0 text-xs text-[#adb5bd]">
          Last Seen: {new Date(user.lastLogin).toLocaleDateString()}
        </p>
      </div>
    </button>
  );
}
