"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type ProductStatus = "판매중" | "예약중" | "판매완료";

export type Product = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  image_url: string | null;
  seller_name: string;
  status: ProductStatus;
  created_at: string;
};

const statusStyles: Record<Exclude<ProductStatus, "판매중">, string> = {
  예약중: "bg-yellow-100 text-yellow-800",
  판매완료: "bg-gray-200 text-gray-600",
};

function formatPrice(price: number) {
  return `₩${price.toLocaleString("ko-KR")}`;
}

function formatTimeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}일 전`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}개월 전`;
  return `${Math.floor(months / 12)}년 전`;
}

export default function ProductList({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const trimmed = deferredQuery.trim();

  const filtered = useMemo(() => {
    if (!trimmed) return products;
    const q = trimmed.toLowerCase();
    return products.filter((p) => p.title.toLowerCase().includes(q));
  }, [products, trimmed]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
            className="size-5"
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
              clipRule="evenodd"
            />
          </svg>
        </span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="찾는 상품을 검색해 보세요"
          aria-label="상품 검색"
          className="w-full rounded-full border border-orange-100 bg-white py-2.5 pl-10 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-100 sm:text-base"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="검색어 지우기"
            className="absolute right-2 top-1/2 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
              className="size-4"
            >
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-orange-200 bg-white px-6 py-16 text-center">
          <p className="text-base text-gray-600 sm:text-lg">
            <span className="font-semibold text-gray-900">
              &lsquo;{trimmed}&rsquo;
            </span>
            에 대한 검색 결과가 없습니다
          </p>
          <p className="mt-1 text-sm text-gray-500">
            다른 검색어로 시도해 보세요
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-orange-100 overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">
          {filtered.map((product) => {
            const sold = product.status === "판매완료";
            return (
              <li key={product.id}>
                <Link
                  href={`/products/${product.id}`}
                  className="flex gap-3 p-3 transition hover:bg-orange-50/70 active:bg-orange-100/60 sm:gap-4 sm:p-4"
                >
                  <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:size-28">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.title}
                        fill
                        sizes="(max-width: 640px) 96px, 112px"
                        className={`object-cover ${sold ? "opacity-60 grayscale" : ""}`}
                      />
                    ) : null}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-1 py-0.5">
                    <div className="min-w-0">
                      <h3 className="line-clamp-2 text-sm font-medium text-gray-900 sm:text-base">
                        {product.title}
                      </h3>
                      <p className="mt-1 line-clamp-1 text-xs text-gray-500 sm:text-sm">
                        {product.seller_name} · {formatTimeAgo(product.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {product.status !== "판매중" && (
                        <span
                          className={`rounded-md px-1.5 py-0.5 text-xs font-medium ${statusStyles[product.status]}`}
                        >
                          {product.status}
                        </span>
                      )}
                      <p className="text-sm font-bold text-gray-900 sm:text-base">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
