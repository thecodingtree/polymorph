import type { PrismaClient } from "@prisma/client";

import { z } from "zod";

import { protectedProcedure, createTRPCRouter } from "~/server/api/trpc";

import {
  TaskCollectionFilterSchema,
  TaskCollectionCreateSchema,
} from "~/schemas";
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
      name: name ? { contains: name } : undefined,
      tasks: tasks ? { some: { id: { in: tasks } } } : undefined,
      ownerId: user,
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
  create: protectedProcedure
    .input(TaskCollectionCreateSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.taskCollection.create({
        data: {
          ...input,
          ownerId: ctx.session?.user.id,
        },
      });
    }),
  // update: protectedProcedure
  //   .input(z.object({ ids: z.array(z.string()), data: TaskUpdateSchema }))
  //   .mutation(async ({ ctx, input }) => {
  //     return ctx.db.task.updateMany({
  //       where: { id: { in: input.ids }, ownerId: ctx.session?.user.id },
  //       data: input.data,
  //     });
  //   }),
  delete: protectedProcedure
    .input(z.object({ ids: z.array(z.string()).min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.taskCollection.deleteMany({
        where: { id: { in: input.ids }, ownerId: ctx.session?.user.id },
      });
    }),
});
