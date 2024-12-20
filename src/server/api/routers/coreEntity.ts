import type { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { CoreEntityCreateSchema, CoreEntityFilterSchema } from "~/schemas";
import type { CoreEntity, CoreEntityFilter, Maybe } from "~/types";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const getEntities = async ({
  prisma,
  input,
  user,
}: {
  prisma: PrismaClient;
  input: CoreEntityFilter;
  user: string;
}): Promise<CoreEntity[]> => {
  const { id, blueprint } = input;

  return prisma.coreEntity.findMany({
    where: {
      ownerId: user,
      AND: [{ id }, { blueprintId: blueprint }],
    },
  });
};

const getEntity = async ({
  prisma,
  input,
  user,
}: {
  prisma: PrismaClient;
  input: CoreEntityFilter;
  user: string;
}): Promise<Maybe<CoreEntity>> => {
  return prisma.coreEntity.findUnique({
    where: { id: input.id, ownerId: user },
  });
};

export const coreEntityRouter = createTRPCRouter({
  list: protectedProcedure
    .input(CoreEntityFilterSchema)
    .query(async ({ ctx, input }) => {
      return getEntities({ prisma: ctx.db, input, user: ctx.session.user.id });
    }),
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const entity = await getEntity({
        prisma: ctx.db,
        input,
        user: ctx.session.user.id,
      });

      if (!entity) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Entity not found",
        });
      }
      return entity;
    }),
  create: protectedProcedure
    .input(CoreEntityCreateSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.coreEntity.create({
        data: {
          blueprintId: input.blueprintId,
          values: [...input.values],
          owner: { connect: { id: ctx.session.user.id } },
        },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.coreEntity.delete({
        where: { id: input.id, ownerId: ctx.session.user.id },
      });
    }),
});
