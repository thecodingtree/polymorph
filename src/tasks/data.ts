import type { PrismaClient } from "@prisma/client";
import { auth } from "~/server/auth";

import type { TaskFilter, Task } from "~/tasks/types";

export const getTasks = async ({
  prisma,
  input,
  user,
}: {
  prisma: PrismaClient;
  input: TaskFilter;
  user?: string;
}): Promise<Task[]> => {
  if (!user) {
    const session = await auth();
    user = session?.user?.id;

    if (!user) {
      throw new Error("User not found");
    }
  }

  const { type, collection, completed, due, entity } = input;

  const filters = [];

  if (type?.length) {
    filters.push({ type: { in: type } });
  }

  if (collection?.length) {
    filters.push({ collectionId: { in: collection } });
  }

  if (completed !== undefined) {
    filters.push({ completed });
  }

  if (due?.on) {
    const startOfDay = new Date(due.on);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(due.on);
    endOfDay.setHours(23, 59, 59, 999);

    filters.push({ endDate: { gte: startOfDay, lt: endOfDay } });
  }

  if (due?.after) {
    filters.push({ endDate: { gte: due.after } });
  }

  if (due?.before) {
    filters.push({ endDate: { lt: due.before } });
  }

  if (entity) {
    filters.push({ entityId: { in: entity } });
  }

  return prisma.task.findMany({
    where: { AND: [...filters, { ownerId: user }] },
    orderBy: [{ completed: "asc" }, { createdAt: "desc" }],
  });
};
