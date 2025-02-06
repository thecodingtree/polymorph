import type { Prisma } from "@prisma/client";
import { AttributeValueType } from "@prisma/client";
import type { z } from "zod";

import type { CoreEntityCreateSchema, CoreEntityFilterSchema } from "./schemas";

export type CoreEntityBlueprintType = Prisma.CoreEntityBlueprintGetPayload<{
  include: {
    attributes: { include: { attribute: true } };
    parent: { include: { attributes: { include: { attribute: true } } } };
    children: { select: { id: true; name: true; description: true } };
  };
}>;

export type Maybe<T> = NonNullable<T> | undefined | null;
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

export { AttributeValueType };
