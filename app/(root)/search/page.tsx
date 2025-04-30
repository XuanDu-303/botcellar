import { Suspense } from "react";
import SearchPageClient from "./search-page-client";
import LoadingPage from "@/components/shared/loading-page";

export default function SearchPage() {
  return (
    <Suspense
      fallback={<LoadingPage />}
    >
      <SearchPageClient />
    </Suspense>
  );
}
