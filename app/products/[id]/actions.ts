"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function deleteProduct(productId: string) {
  const supabase = await createClient();
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
