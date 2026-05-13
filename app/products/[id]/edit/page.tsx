import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProductForm from "../../_components/product-form";
import { updateProduct } from "./actions";

type Product = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  image_url: string | null;
  seller_name: string;
};

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, title, description, price, image_url, seller_name")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const product = data as Product;
  const action = updateProduct.bind(null, id);

  return (
    <main className="flex-1 bg-orange-50/40">
      <header className="sticky top-0 z-10 bg-orange-500 shadow-sm">
        <div className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-3.5 sm:px-6 sm:py-4">
          <Link
            href={`/products/${id}`}
            aria-label="취소하고 상세 페이지로 돌아가기"
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
          <h1 className="text-base font-semibold text-white sm:text-lg">
            상품 수정
          </h1>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-4 py-5 sm:px-6 sm:py-6">
        <ProductForm
          action={action}
          defaultValues={{
            title: product.title,
            price: String(product.price),
            description: product.description ?? "",
            image_url: product.image_url ?? "",
            seller_name: product.seller_name,
          }}
          submitLabel="수정"
          pendingLabel="수정 중..."
          cancelHref={`/products/${id}`}
        />
      </section>
    </main>
  );
}
