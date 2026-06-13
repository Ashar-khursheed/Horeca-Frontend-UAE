"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import Pagination from "@/components/pagination";

interface OrdersPaginationProps {
  totalPages: number;
  currentPage: number;
}

export function OrdersPagination({ totalPages, currentPage }: OrdersPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(page));
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  if (totalPages <= 1) return null;

  return (
    <div className="py-4">
      <Pagination
        key={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        showFirstLast
        showPageInfo
      />
    </div>
  );
}
