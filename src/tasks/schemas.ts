import { z } from "zod";

import { MaybeStringSchema, MaybeDateSchema } from "~/schemas";
import { TaskType, TaskPriority } from "~/tasks/types";

export const TasksFilterSchema = z.object({
  type: z.array(z.nativeEnum(TaskType)).optional(),
  collection: z.array(z.string()).optional(),
  completed: z.boolean().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  entity: z.array(z.string()).optional(),
});

export const TaskCreateSchema = z.object({
  type: z.nativeEnum(TaskType),
  title: z.string().min(1),
  description: MaybeStringSchema,
  entity: z.string().optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  private: z.boolean().optional(),
  completed: z.boolean().optional(),
  collection: z.string().optional(),
  startDate: MaybeDateSchema,
  endDate: MaybeDateSchema,
});

export const TaskUpdateSchema = z.object({
  type: z.nativeEnum(TaskType).optional(),
  description: z.string().optional(),
  title: z.string().optional(),
  entity: z.string().optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  private: z.boolean().optional(),
  completed: z.boolean().optional(),
  collection: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

export const TaskCollectionFilterSchema = z.object({
  name: z.string().optional(),
  tasks: z.array(z.string()).optional(),
});

export const TaskCollectionCreateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export const TaskCollectionUpdateSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  tasks: z.array(z.string()).optional(),
});
