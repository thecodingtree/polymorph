import type { PrismaClient } from "@prisma/client";

import type { TaskCollectionFilter, TaskCollection } from "~/tasks/types";

import { auth } from "~/server/auth";

export const getTaskCollections = async ({
  prisma,
  input,
  user,
}: {
  prisma: PrismaClient;
  input: TaskCollectionFilter;
  user?: string;
}): Promise<TaskCollection[]> => {
  const { name, tasks } = input;

  if (!user) {
    const session = await auth();
    user = session?.user?.id;

    if (!user) {
      throw new Error("User not found");
    }
  }

  return (await prisma.taskCollection.findMany({
    where: {
      name: name ? { contains: name } : undefined,
      tasks: tasks ? { some: { id: { in: tasks } } } : undefined,
      ownerId: user,
    },
    orderBy: { rank: "asc" },
  })) satisfies TaskCollection[];
};
