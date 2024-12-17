import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const CoreEntityTypeCreate = z.object({
  name: z.string(),
  description: z.string().optional(),
  entities: z.array(z.string()).optional(),
});

export const CoreEntityTypeUpdate = z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  entities: z.array(z.string()).optional(),
});

export const CoreEntityTypeGet = z.object({
  id: z.string(),
});

export const coreEntityTypeRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.coreEntityType.findMany({
      where: { ownerId: ctx.session.user.id },
    });
  }),
  get: protectedProcedure
    .input(CoreEntityTypeGet)
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
    .input(CoreEntityTypeCreate)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.coreEntityType.create({
        data: {
          owner: { connect: { id: ctx.session.user.id } },
          name: input.name,
          description: input.description ?? "",
          entities: input.entities
            ? { connect: input.entities.map((id) => ({ id })) }
            : undefined,
        },
      });
    }),
  update: protectedProcedure
    .input(CoreEntityTypeUpdate)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.coreEntityType.update({
        where: { id: input.id, ownerId: ctx.session.user.id },
        data: { name: input?.name, description: input?.description },
      });
    }),
  delete: protectedProcedure
    .input(CoreEntityTypeGet)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.coreEntityType.delete({
        where: { id: input.id, ownerId: ctx.session.user.id },
      });
    }),
});
