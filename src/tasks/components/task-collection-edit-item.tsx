import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Grip, Check, Trash } from "lucide-react";

import { Button } from "~/app/_components/ui/button";
import { Card, CardHeader, CardTitle } from "~/app/_components/ui/card";
import { ConfirmDialog } from "~/app/_components/dialogs/confirm-dialog";
import { Input } from "~/app/_components/ui/input";
import type { TaskCollection } from "~/tasks/types";

export function TaskCollectionEditItem({
  collection,
  onUpdate,
  onDelete,
}: {
  collection: TaskCollection;
  onUpdate?: (collectionId: string, name: string) => void;
  onDelete?: (collectionId: string) => void;
}) {
  const [collectionTitle, setCollectionTitle] = useState(collection.name);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: collection.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card ref={setNodeRef} style={style} className="bg-slate-400">
      <CardHeader className="flex h-16 flex-row items-center justify-between">
        <CardTitle className="flex w-full flex-row items-center">
          <Grip {...attributes} {...listeners} className="mr-2 h-6 w-6" />
          <Input
            className="w-full bg-white"
            value={collectionTitle}
            onChange={(e) => setCollectionTitle(e.target.value)}
          />
        </CardTitle>
        <div className="flex flex-row">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              onUpdate?.(collection.id, collectionTitle);
            }}
          >
            <Check />
          </Button>
          <ConfirmDialog
            title="Are you sure you want to delete this collection?"
            description="This can not be undone"
            onConfirm={() => {
              onDelete?.(collection.id);
            }}
            trigger={
              <Button variant="ghost" size="icon">
                <Trash />
              </Button>
            }
          />
        </div>
      </CardHeader>
    </Card>
  );
}
