'use client';

import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col min-h-screen justify-center items-center text-center space-y-6 px-4">
      <div className="text-primary text-7xl font-bold">🚫</div>

      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>

      <p className="text-muted-foreground max-w-md">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>

      <Link
        href="/"
        className="px-6 py-2 rounded bg-primary text-white hover:bg-primary/80 transition"
      >
        Back to Home
      </Link>
    </div>
  );
}
