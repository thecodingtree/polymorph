import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const CoreEntityBlueprintCreate = z.object({
  name: z.string(),
  description: z.string().optional(),
  public: z.boolean(),
  parent: z.string().optional(),
  attributes: z.array(z.string()),
});

const CoreEntityBlueprintFilter = z.object({
  id: z.array(z.string()).optional(),
  search: z.string().optional(),
  parent: z.string().optional(),
});

const buildFilters = (input: z.infer<typeof CoreEntityBlueprintFilter>) => {
  const filters = [];

  if (input.id) {
    filters.push({ id: { in: input.id } });
  }

  if (input.search) {
    filters.push({ name: { contains: input.search } });
    filters.push({ description: { contains: input.search } });
  }

  if (input.parent) {
    filters.push({ parentId: input.parent });
  }

  return filters;
};

export const coreEntityBlueprintRouter = createTRPCRouter({
  create: protectedProcedure
    .input(CoreEntityBlueprintCreate)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.coreEntityBlueprint.create({
        data: {
          name: input.name,
          description: input.description,
          parent: { connect: { id: input.parent } },
          public: input.public,
          owner: { connect: { id: ctx.session.user.id } },
          attributes: {
            create: input.attributes.map((attributeId) => ({
              attribute: { connect: { id: attributeId } },
            })),
          },
        },
      });
    }),
  list: protectedProcedure
    .input(CoreEntityBlueprintFilter)
    .query(async ({ ctx, input }) => {
      return ctx.db.coreEntityBlueprint.findMany({
        where: {
          OR: [{ ownerId: ctx.session.user.id }, { public: true }],
          AND: buildFilters(input),
        },
        include: {
          attributes: { include: { attribute: true } },
          parent: { include: { attributes: { include: { attribute: true } } } },
          children: { select: { id: true, name: true, description: true } },
        },
      });
    }),
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const entity = await ctx.db.coreEntityBlueprint.findUnique({
        where: {
          id: input.id,
          OR: [{ ownerId: ctx.session.user.id }, { public: true }],
        },
      });
      if (!entity) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Entity not found",
        });
      }
      return entity;
    }),
});
