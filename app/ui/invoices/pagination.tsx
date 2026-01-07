"use client";

import React from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { generatePagination } from "@/app/lib/utils";

interface PaginationProps {
  totalPages: number;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get("page")) || 1;

  if (totalPages <= 1) return null;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const allPages = generatePagination(currentPage, totalPages);

  return (
    <nav className="flex items-center justify-center gap-2">
      {/* Previous */}
      <Link
        href={createPageURL(currentPage - 1)}
        className={clsx(
          "flex h-10 w-10 items-center justify-center rounded-md border",
          {
            "pointer-events-none opacity-50": currentPage <= 1,
          }
        )}
      >
        <ArrowLeftIcon className="w-4" />
      </Link>

      {/* Page Numbers */}
      {allPages.map((page, index) =>
        typeof page === "number" ? (
          <Link
            key={index}
            href={createPageURL(page)}
            className={clsx(
              "flex h-10 w-10 items-center justify-center rounded-md border text-sm",
              {
                "bg-blue-600 text-white": page === currentPage,
                "hover:bg-gray-100": page !== currentPage,
              }
            )}
          >
            {page}
          </Link>
        ) : (
          <span
            key={index}
            className="flex h-10 w-10 items-center justify-center text-sm"
          >
            …
          </span>
        )
      )}

      {/* Next */}
      <Link
        href={createPageURL(currentPage + 1)}
        className={clsx(
          "flex h-10 w-10 items-center justify-center rounded-md border",
          {
            "pointer-events-none opacity-50": currentPage >= totalPages,
          }
        )}
      >
        <ArrowRightIcon className="w-4" />
      </Link>
    </nav>
  );
};

export default Pagination;
