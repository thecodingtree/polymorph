import type { PrismaClient } from "@prisma/client";

import { z } from "zod";

import { protectedProcedure, createTRPCRouter } from "~/server/api/trpc";

import { TasksFilterSchema } from "~/schemas";
import type { TaskFilter, Task } from "~/types";

const getTasks = async ({
  prisma,
  input,
  user,
}: {
  prisma: PrismaClient;
  input: TaskFilter;
  user: string;
}): Promise<Task[]> => {
  const { type, completed, startDate, endDate, entity } = input;

  const filters = [];

  if (type) {
    filters.push({ type });
  }

  if (completed) {
    filters.push({ completed });
  }

  if (startDate) {
    filters.push({ startDate: { gte: startDate } });
  }

  if (endDate) {
    filters.push({ endDate: { lte: endDate } });
  }

  if (entity) {
    filters.push({ entityId: { in: entity } });
  }

  return prisma.task.findMany({
    where: { AND: [...filters, { ownerId: user }] },
  });
};

export const taskRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.task.findUnique({
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
  // create: protectedProcedure
  //   .input(taskInput)
  //   .mutation(async ({ ctx, input }) => {
  //     return ctx.prisma.task.create({
  //       data: {
  //         creatorId: ctx.session?.user.id!,
  //         type: input.type,
  //         description: input.description,
  //         content: input.content,
  //         entityId: input.entity,
  //         priority: input.priority,
  //         private: input.isPrivate,
  //         completed: input.completed,
  //         startDate: input.startDate,
  //         endDate: input.endDate,
  //       },
  //     });
  //   }),
  // completeTasks: protectedProcedure
  //   .input(z.object({ taskIds: z.array(z.string()) }))
  //   .mutation(async ({ ctx, input }) => {
  //     return ctx.prisma.task.updateMany({
  //       where: {
  //         id: {
  //           in: input.taskIds,
  //         },
  //       },
  //       data: {
  //         completed: true,
  //       },
  //     });
  //   }),
});
