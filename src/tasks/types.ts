import type { z } from "zod";
import { TaskPriority, TaskType } from "@prisma/client";
import type { Maybe } from "~/types";

import type {
  TasksFilterSchema,
  TaskCreateSchema,
  TaskUpdateSchema,
  TaskCollectionFilterSchema,
} from "~/tasks/schemas";

export interface Task {
  id: string;
  type: TaskType;
  ownerId: Maybe<string>;
  title: string;
  description: Maybe<string>;
  completed: boolean;
  private: boolean;
  startDate: Maybe<Date>;
  endDate: Maybe<Date>;
  priority: TaskPriority;
  entityId: Maybe<string>;
  collectionId: Maybe<string>;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskFilter = z.infer<typeof TasksFilterSchema>;
export type TaskCreate = z.infer<typeof TaskCreateSchema>;
export type TaskUpdate = z.infer<typeof TaskUpdateSchema>;
export interface TaskCollection {
  id: string;
  name: string;
  description: Maybe<string>;
  ownerId: Maybe<string>;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskCollectionFilter = z.infer<typeof TaskCollectionFilterSchema>;

export { TaskPriority, TaskType };
