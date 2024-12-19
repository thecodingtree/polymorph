import { AttributeValueType } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const CoreEntityCreate = z.object({
  blueprintId: z.string(),
  values: z
    .array(
      z.object({
        attributeId: z.string(),
        type: z.nativeEnum(AttributeValueType),
        value: z.string().optional(),
      }),
    )
    .min(1),
});

export const CoreEntityFilter = z.object({
  id: z.string().optional(),
  blueprint: z.string().optional(),
});

export const coreEntityRouter = createTRPCRouter({
  list: protectedProcedure
    .input(CoreEntityFilter)
    .query(async ({ ctx, input }) => {
      return ctx.db.coreEntity.findMany({
        where: {
          ownerId: ctx.session.user.id,
          AND: [{ id: input.id }, { blueprintId: input.blueprint }],
        },
      });
    }),
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const entity = await ctx.db.coreEntity.findUnique({
        where: { id: input.id, ownerId: ctx.session.user.id },
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
