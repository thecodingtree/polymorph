"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import type {
  TaskCollectionMutator,
  TaskCollectionDeleter,
} from "~/tasks/hooks/useTaskCollectionApi";

import {
  createSortablePayloadByIndex,
  getBetweenRankAsc,
} from "~/lib/lexorank-sort-helper";

import { type TaskCollection } from "~/tasks/types";

import { TaskCollectionEditItem } from "./task-collection-edit-item";

export default function TaskCollectionEdit({
  collections,
  updator,
  deletor,
}: {
  collections: TaskCollection[];
  updator: TaskCollectionMutator;
  deletor: TaskCollectionDeleter;
}) {
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDelete = (collectionId: string) => {
    deletor.mutate({ ids: [collectionId] });
  };

  const handleUpdate = (collectionId: string, name: string) => {
    updator.mutate({
      ids: [collectionId],
      data: { name },
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const sortablePayload = createSortablePayloadByIndex(
      collections ?? [],
      event,
    );

    const newRank = getBetweenRankAsc(sortablePayload);

    const collection = collections?.find(
      (x) => x.id === sortablePayload.entity.id,
    );

    if (!collection) {
      return;
    }

    updator.mutate({
      ids: [collection.id],
      data: {
        rank: newRank.toString(),
      },
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={collections ?? []}
        strategy={verticalListSortingStrategy}
      >
        {collections?.map((collection) => (
          <div key={collection.id}>
            <TaskCollectionEditItem
              collection={collection}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          </div>
        ))}
      </SortableContext>
    </DndContext>
  );
}
