import { Suspense } from "react";
import SearchPageClient from "./search-page-client";

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading search page...</div>}>
      <SearchPageClient />
    </Suspense>
  );
}
