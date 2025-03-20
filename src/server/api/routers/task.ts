import type { PrismaClient } from "@prisma/client";
import { de } from "date-fns/locale";

import { z } from "zod";

import { protectedProcedure, createTRPCRouter } from "~/server/api/trpc";

import {
  TaskCreateSchema,
  TaskUpdateSchema,
  TasksFilterSchema,
} from "~/tasks/schemas";
import type { TaskFilter, Task } from "~/tasks/types";

const getTasks = async ({
  prisma,
  input,
  user,
}: {
  prisma: PrismaClient;
  input: TaskFilter;
  user: string;
}): Promise<Task[]> => {
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

export const taskRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.task.findUnique({
        where: { id: input.id, ownerId: ctx.session?.user.id },
      });
    }),
  list: protectedProcedure
    .input(TasksFilterSchema)
    .query(async ({ ctx, input }) => {
      return await getTasks({
        prisma: ctx.db,
        input,
        user: ctx.session?.user.id,
      });
    }),
  create: protectedProcedure
    .input(TaskCreateSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.create({
        data: {
          ownerId: ctx.session?.user.id,
          type: input.type,
          description: input?.description,
          title: input?.title,
          entityId: input.entity,
          collectionId: input.collection,
          priority: input?.priority,
          private: input?.private,
          completed: input?.completed,
          startDate: input?.startDate,
          endDate: input?.endDate ?? undefined, // defaults to now() if not provided
        },
      });
    }),
  update: protectedProcedure
    .input(z.object({ ids: z.array(z.string()), data: TaskUpdateSchema }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.updateMany({
        where: { id: { in: input.ids }, ownerId: ctx.session?.user.id },
        data: input.data,
      });
    }),
  delete: protectedProcedure
    .input(z.object({ ids: z.array(z.string()).min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.deleteMany({
        where: { id: { in: input.ids }, ownerId: ctx.session?.user.id },
      });
    }),
});
