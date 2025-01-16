import { TRPCError } from "@trpc/server";
import { z } from "zod";
import type { PrismaClient } from "@prisma/client";

import {
  CoreEntityBlueprintCreateSchema,
  CoreEntityBlueprintFilterSchema,
} from "~/schemas";
import type { Maybe, CoreEntityBlueprint } from "~/types";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const buildFilters = (
  input: z.infer<typeof CoreEntityBlueprintFilterSchema>,
) => {
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

const listBlueprints = async ({
  prisma,
  input,
  user,
}: {
  prisma: PrismaClient;
  input: z.infer<typeof CoreEntityBlueprintFilterSchema>;
  user: string;
}): Promise<CoreEntityBlueprint[]> => {
  return await prisma.coreEntityBlueprint.findMany({
    where: {
      OR: [{ ownerId: user }, { public: true }],
      AND: buildFilters(input),
    },
    include: {
      attributes: { include: { attribute: true } },
      children: { select: { id: true, name: true, description: true } },
    },
  });
};

const getBlueprint = async (
  id: string,
  user: string,
  prisma: PrismaClient,
): Promise<Maybe<CoreEntityBlueprint>> => {
  return prisma.coreEntityBlueprint.findUnique({
    where: {
      id,
      OR: [{ ownerId: user }, { public: true }],
    },
    include: {
      attributes: { include: { attribute: true } },
      children: { select: { id: true, name: true, description: true } },
    },
  });
};

export const coreEntityBlueprintRouter = createTRPCRouter({
  create: protectedProcedure
    .input(CoreEntityBlueprintCreateSchema)
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
    .input(CoreEntityBlueprintFilterSchema)
    .query(async ({ ctx, input }) => {
      return listBlueprints({
        prisma: ctx.db,
        input,
        user: ctx.session.user.id,
      });
    }),
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const entity = await getBlueprint(ctx.session.user.id, input.id, ctx.db);

      if (!entity) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Entity not found",
        });
      }
      return entity;
    }),
});
