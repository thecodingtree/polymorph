"use client";

import React from "react";

import { api } from "~/trpc/react";
import type { CoreEntityResponse } from "~/server/api/routers/coreEntity";
import { Card, CardTitle, CardContent } from "~/app/_components/ui/card";

import { Button } from "~/app/_components/ui/button";

export default function EntityItem({
  entity,
}: {
  entity: CoreEntityResponse;
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
        <div>{entity?.type?.name}</div>
        <div>{entity?.type?.description}</div>
      </CardContent>
    </Card>
  );
}
