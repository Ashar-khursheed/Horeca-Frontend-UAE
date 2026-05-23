import SearchFeature from "@/features/search";
import { Suspense } from "react";

export default function SearchPage() {
  return (
    <Suspense>
      <SearchFeature />
    </Suspense>
  );
}
