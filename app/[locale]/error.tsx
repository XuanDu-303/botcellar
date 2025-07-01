'use client';

import Link from 'next/link';

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);

  return (
    <div className="flex flex-col min-h-screen justify-center items-center text-center space-y-6 px-4">
      <div className="text-primary text-7xl font-bold">😥</div>

      <h1 className="text-3xl font-bold">Something went wrong!</h1>

      <p className="text-muted-foreground max-w-md">
        {error?.message || "An unexpected error occurred. Please try again later."}
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-2 rounded bg-primary text-white hover:bg-primary/80 transition"
        >
          Try Again
        </button>

        <Link
          href="/"
          className="px-6 py-2 rounded border border-primary text-primary hover:bg-primary hover:text-white transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
