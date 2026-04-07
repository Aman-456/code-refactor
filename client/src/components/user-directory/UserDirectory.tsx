'use client';

import { useUserDirectory } from '@/hooks/useUserDirectory';
import { LayoutToggle } from './LayoutToggle';
import { PaginationControls } from './PaginationControls';
import { UserCard } from './UserCard';
import { UserSearchBar } from './UserSearchBar';

export function UserDirectory() {
  const {
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
  } = useUserDirectory();

  if (loading && users.length === 0 && !error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f4f4]">
        <p className="mt-2 text-lg text-[#343a40]">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f9fa]">
        <p className="text-base text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans text-[#212529]">
      <header className="mb-5 border-b border-[#e9ecef] bg-white px-5 py-5">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="m-0 text-2xl font-bold text-[#212529]">User Directory</h1>
          <LayoutToggle
            layout={layout}
            onLayoutChange={setLayout}
            disabled={loading}
          />
        </div>
      </header>

      <div
        className={`mx-auto px-5 pb-12 ${layout === 'grid' ? 'max-w-6xl' : 'max-w-[800px]'}`}
      >
        <UserSearchBar
          queryParam={q}
          onSearch={applySearch}
          disabled={loading}
        />

        <ul
          className={`list-none p-0 ${
            layout === 'grid'
              ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'
              : 'flex flex-col gap-4'
          }`}
        >
          {users.map((user) => (
            <li key={user.id} className={layout === 'grid' ? 'min-w-0' : ''}>
              <UserCard user={user} variant={layout} />
            </li>
          ))}
        </ul>

        {users.length === 0 && !loading ? (
          <p className="py-8 text-center text-[#6c757d]">No users match your search.</p>
        ) : null}

        {total > 0 ? (
          <PaginationControls
            page={page}
            limit={limit}
            total={total}
            onPageChange={goToPage}
            onLimitChange={setLimit}
            disabled={loading}
          />
        ) : null}
      </div>
    </div>
  );
}
