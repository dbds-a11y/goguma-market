import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CheckoutWidget from "./checkout-widget";

type Product = {
  id: string;
  title: string;
  price: number;
  image_url: string | null;
  seller_name: string;
  status: "판매중" | "예약중" | "판매완료";
};

function formatPrice(price: number) {
  return `₩${price.toLocaleString("ko-KR")}`;
}

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const supabase = await createClient();

  const [{ data, error }, { data: userData }] = await Promise.all([
    supabase
      .from("products")
      .select("id, title, price, image_url, seller_name, status")
      .eq("id", productId)
      .maybeSingle(),
    supabase.auth.getUser(),
  ]);

  if (error || !data) {
    notFound();
  }

  // 미들웨어가 /checkout/* 미로그인을 차단하지만, 방어적으로 한 번 더 체크
  const user = userData.user;
  if (!user) {
    notFound();
  }

  const product = data as Product;

  if (product.status === "판매완료") {
    return (
      <main className="flex-1 bg-orange-50/40">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-4 py-20 text-center">
          <p className="text-lg font-semibold text-gray-800">
            이미 판매완료된 상품입니다
          </p>
          <Link
            href={`/products/${product.id}`}
            className="rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
          >
            상품으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-orange-50/40 pb-24">
      <header className="sticky top-0 z-10 bg-orange-500 shadow-sm">
        <div className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-3.5 sm:px-6 sm:py-4">
          <Link
            href={`/products/${product.id}`}
            aria-label="상품으로 돌아가기"
            className="-ml-2 inline-flex size-9 items-center justify-center rounded-full text-white transition hover:bg-white/20 active:bg-white/30"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
              className="size-5"
            >
              <path
                fillRule="evenodd"
                d="M11.78 5.22a.75.75 0 010 1.06L8.06 10l3.72 3.72a.75.75 0 11-1.06 1.06l-4.25-4.25a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 0z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
          <h1 className="flex-1 text-base font-semibold text-white sm:text-lg">
            결제하기
          </h1>
        </div>
      </header>

      <section className="mx-auto max-w-3xl bg-white">
        <div className="flex items-center gap-4 border-b border-orange-100 px-4 py-4 sm:px-6">
          <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
            {product.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.image_url}
                alt={product.title}
                className="size-full object-cover"
              />
            ) : null}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-900 sm:text-base">
              {product.title}
            </p>
            <p className="text-xs text-gray-500 sm:text-sm">
              판매자 {product.seller_name}
            </p>
          </div>
          <p className="shrink-0 text-base font-bold text-gray-900 sm:text-lg">
            {formatPrice(product.price)}
          </p>
        </div>
      </section>

      <CheckoutWidget
        productId={product.id}
        orderName={product.title}
        amount={product.price}
        customerKey={user.id.replace(/-/g, "")}
        customerEmail={user.email ?? undefined}
      />
    </main>
  );
}
