import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const AttributeCreate = z.object({
  name: z.string(),
});

export const CoreEntityGet = z.object({
  id: z.string(),
});

export const coreEntityRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.coreEntity.findMany({
      where: { ownerId: ctx.session.user.id },
      include: { type: true },
    });
  }),
  get: protectedProcedure.input(CoreEntityGet).query(async ({ ctx, input }) => {
    const entity = await ctx.db.coreEntity.findUnique({
      where: { id: input.id, ownerId: ctx.session.user.id },
      include: { type: true },
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
    .input(CoreEntityCreate)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.coreEntity.create({
        data: {
          type: { connect: { id: input.typeId } },
          owner: { connect: { id: ctx.session.user.id } },
        },
      });
    }),
  delete: protectedProcedure
    .input(CoreEntityGet)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.coreEntity.delete({
        where: { id: input.id, ownerId: ctx.session.user.id },
      });
    }),
});
