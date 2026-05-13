"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function deleteProduct(productId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("로그인이 필요합니다");
  }

  const { data: existing } = await supabase
    .from("products")
    .select("user_id")
    .eq("id", productId)
    .maybeSingle();

  if (!existing) {
    throw new Error("상품을 찾을 수 없습니다");
  }
  if (existing.user_id !== user.id) {
    throw new Error("본인이 등록한 상품만 삭제할 수 있습니다");
  }

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) {
    throw new Error(`삭제에 실패했습니다: ${error.message}`);
  }

  revalidatePath("/");
  redirect("/");
}
