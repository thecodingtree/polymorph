import type { PrismaClient } from "@prisma/client";

import { z } from "zod";

import { protectedProcedure, createTRPCRouter } from "~/server/api/trpc";

import { TaskCollectionFilterSchema } from "~/schemas";
import type { TaskCollectionFilter, TaskCollection, Maybe } from "~/types";

const getTaskCollections = async ({
  prisma,
  input,
  user,
}: {
  prisma: PrismaClient;
  input: TaskCollectionFilter;
  user: string;
}): Promise<TaskCollection[]> => {
  const { name, tasks } = input;

  return (await prisma.taskCollection.findMany({
    where: {
      name: { contains: name },
      tasks: { some: { id: { in: tasks } } },
      ownerId: user,
    },
    include: {
      tasks: true,
    },
  })) satisfies TaskCollection[];
};

export const taskCollectionRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return (await ctx?.db?.taskCollection.findUnique({
        where: { id: input.id, ownerId: ctx.session?.user.id },
        include: { tasks: true },
      })) satisfies Maybe<TaskCollection>;
    }),
  list: protectedProcedure
    .input(TaskCollectionFilterSchema)
    .query(async ({ ctx, input }) => {
      return await getTaskCollections({
        prisma: ctx.db,
        input,
        user: ctx.session?.user.id,
      });
    }),
  // create: protectedProcedure
  //   .input(TaskCreateSchema)
  //   .mutation(async ({ ctx, input }) => {
  //     return ctx.db.task.create({
  //       data: {
  //         ownerId: ctx.session?.user.id,
  //         type: input.type,
  //         description: input?.description,
  //         content: input?.content,
  //         entityId: input.entity,
  //         priority: input?.priority,
  //         private: input?.isPrivate,
  //         completed: input?.completed,
  //         startDate: input?.startDate,
  //         endDate: input?.endDate,
  //       },
  //     });
  //   }),
  // update: protectedProcedure
  //   .input(z.object({ ids: z.array(z.string()), data: TaskUpdateSchema }))
  //   .mutation(async ({ ctx, input }) => {
  //     return ctx.db.task.updateMany({
  //       where: { id: { in: input.ids }, ownerId: ctx.session?.user.id },
  //       data: input.data,
  //     });
  //   }),
  // delete: protectedProcedure
  //   .input(z.object({ ids: z.array(z.string()).min(1) }))
  //   .mutation(async ({ ctx, input }) => {
  //     return ctx.db.task.deleteMany({
  //       where: { id: { in: input.ids }, ownerId: ctx.session?.user.id },
  //     });
  //   }),
});
