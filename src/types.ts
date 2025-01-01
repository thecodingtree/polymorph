import type { Prisma } from "@prisma/client";
import { AttributeValueType, TaskPriority, TaskType } from "@prisma/client";
import type { z } from "zod";

import type {
  CoreEntityCreateSchema,
  CoreEntityFilterSchema,
  TasksFilterSchema,
} from "./schemas";

export type CoreEntityBlueprintType = Prisma.CoreEntityBlueprintGetPayload<{
  include: {
    attributes: { include: { attribute: true } };
    parent: { include: { attributes: { include: { attribute: true } } } };
    children: { select: { id: true; name: true; description: true } };
  };
}>;

export type Maybe<T> = T | null;
interface Attribute {
  id: string;
  name: string;
  description: Maybe<string>;
  valueType: AttributeValueType;
  public: boolean;
  ownerId: Maybe<string>;
}

export interface CoreEntityBlueprint {
  id: string;
  name: string;
  description: Maybe<string>;
  public: boolean;
  ownerId: Maybe<string>;
  attributes: { attribute: Maybe<Attribute>; required: boolean }[];
  parentId: Maybe<string>;
  children: { id: string; name: string; description: Maybe<string> }[];
}

export interface AttributeValue {
  attributeId: Maybe<string>;
  type: AttributeValueType;
  value: Prisma.JsonValue;
}

export interface CoreEntity {
  id: string;
  blueprintId: Maybe<string>;
  values: AttributeValue[];
}

export type CoreEntityCreate = z.infer<typeof CoreEntityCreateSchema>;
export type CoreEntityFilter = z.infer<typeof CoreEntityFilterSchema>;

export interface Task {
  id: string;
  type: TaskType;
  ownerId: Maybe<string>;
  description: string;
  content: Maybe<string>;
  completed: boolean;
  private: boolean;
  startDate: Maybe<Date>;
  endDate: Maybe<Date>;
  priority: TaskPriority;
  entityId: Maybe<string>;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskFilter = z.infer<typeof TasksFilterSchema>;

export { AttributeValueType, TaskPriority, TaskType };
