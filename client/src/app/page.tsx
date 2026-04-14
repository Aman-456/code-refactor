import { Suspense } from 'react';
import { UserDirectory } from '@/components/user-directory/UserDirectory';

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f4f4f4]">
          <p className="text-lg text-[#343a40]">Loading directory…</p>
        </div>
      }
    >
      <UserDirectory />
    </Suspense>
  );
}
