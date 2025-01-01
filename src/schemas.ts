import { z } from "zod";

import { TaskType, TaskPriority } from "./types";

import { AttributeValueType } from "@prisma/client";

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
type Literal = z.infer<typeof literalSchema>;
type Json = Literal | { [key: string]: Json } | Json[];
const jsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]),
);

export const AttributeValueSchema = z.object({
  attributeId: z.string().optional(),
  type: z.nativeEnum(AttributeValueType),
  value: jsonSchema.optional(),
});

export const CoreEntityCreateSchema = z.object({
  blueprintId: z.string(),
  values: AttributeValueSchema.array(),
});

export const CoreEntityFilterSchema = z.object({
  id: z.string().optional(),
  blueprint: z.string().optional(),
});

export const CoreEntityBlueprintCreateSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  public: z.boolean(),
  parent: z.string().optional(),
  attributes: z.array(z.string()),
});

export const CoreEntityBlueprintFilterSchema = z.object({
  id: z.array(z.string()).optional(),
  search: z.string().optional(),
  parent: z.string().optional(),
});

export const TasksFilterSchema = z.object({
  type: z.nativeEnum(TaskType).optional(),
  completed: z.boolean().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  entity: z.array(z.string()).optional(),
});

export const TaskCreateSchema = z.object({
  type: z.nativeEnum(TaskType),
  description: z.string(),
  content: z.string().optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  isPrivate: z.boolean().optional(),
  completed: z.boolean().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});
