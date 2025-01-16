"use client";

import React from "react";

import { api } from "~/trpc/react";
import type { CoreEntity } from "~/types";
import { Card, CardTitle, CardContent } from "~/app/_components/ui/card";

import { Button } from "~/app/_components/ui/button";

export default function EntityItem({
  entity,
}: {
  entity: CoreEntity;
  onDelete?: () => void;
}) {
  const deleteEntity = api.coreEntity.delete.useMutation();

  return (
    <Card className="p-1">
      <CardTitle>
        <Button
          onClick={() => deleteEntity.mutate({ id: entity.id })}
          disabled={deleteEntity.isPending}
        />
      </CardTitle>
      <CardContent>
        <div>{entity?.id}</div>
        <div>
          <ul>
            {entity?.values?.map((val) => (
              <li key={val.attributeId}>
                {val.type} {JSON.stringify(val.value)}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
