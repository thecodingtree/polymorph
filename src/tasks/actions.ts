"use server";

import { revalidatePath } from "next/cache";

import { api } from "~/trpc/server";

export async function completeTask(id: string) {
  await api.task.update({
    ids: [id],
    data: { completed: true },
  });

  revalidatePath("/");
}
