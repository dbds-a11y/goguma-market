"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { ProductFormState } from "../_components/product-form";

function deriveSellerName(user: User): string {
  const meta = user.user_metadata as
    | { name?: string; full_name?: string; user_name?: string; preferred_username?: string }
    | undefined;
  const fromMeta =
    meta?.name ?? meta?.full_name ?? meta?.user_name ?? meta?.preferred_username;
  if (fromMeta && fromMeta.trim()) return fromMeta.trim().slice(0, 40);
  if (user.email) return user.email.split("@")[0].slice(0, 40);
  return "익명";
}

export async function createProduct(
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/products/new");
  }

  const title = String(formData.get("title") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const imageUrl = String(formData.get("image_url") ?? "").trim();

  const values = {
    title,
    price: priceRaw,
    description,
    image_url: imageUrl,
  };

  const fieldErrors: NonNullable<ProductFormState["fieldErrors"]> = {};

  if (!title) {
    fieldErrors.title = "상품명을 입력해주세요";
  }

  const price = Number(priceRaw);
  if (!priceRaw) {
    fieldErrors.price = "가격을 입력해주세요";
  } else if (!Number.isFinite(price) || price < 0) {
    fieldErrors.price = "0 이상의 숫자를 입력해주세요";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors, values };
  }

  const { error } = await supabase.from("products").insert({
    title,
    price: Math.trunc(price),
    description: description || null,
    image_url: imageUrl || null,
    seller_name: deriveSellerName(user),
    user_id: user.id,
  });

  if (error) {
    return { error: `등록에 실패했습니다: ${error.message}`, values };
  }

  revalidatePath("/");
  redirect("/");
}
