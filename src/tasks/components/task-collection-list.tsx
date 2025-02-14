"use client";

import { useState } from "react";

import { LexoRank } from "lexorank";

import { useTaskCollectionApi } from "~/tasks/hooks/useTaskCollectionApi";

import type { TaskCollectionFilter } from "~/tasks/types";

import TaskCollection from "~/tasks/components/task-collection";
import TaskCollectionActions from "~/tasks/components/task-collection-actions";
import TaskCollectionEdit from "./task-collection-edit";

export default function TaskCollectionList({
  filter,
}: {
  filter: TaskCollectionFilter;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const { collections, updateCollection, createCollection, deleteCollection } =
    useTaskCollectionApi(filter);

  const handleAddCollection = (name: string) => {
    const lastCollection = collections?.[collections.length - 1];

    if (!lastCollection) {
      const rank = LexoRank.middle();
      createCollection.mutate({
        name,
        rank: rank.toString(),
        collapsed: false,
      });
    } else {
      const newRank = LexoRank.parse(lastCollection.rank).genNext();
      createCollection.mutate({
        name,
        rank: newRank.toString(),
        collapsed: false,
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <TaskCollectionActions
        isEditing={isEditing}
        onEditChange={(edit) => setIsEditing(edit)}
        onAddCollection={handleAddCollection}
      />
      {isEditing ? (
        <TaskCollectionEdit
          collections={collections ?? []}
          updator={updateCollection}
          deletor={deleteCollection}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {collections?.map((collection) => (
            <TaskCollection
              key={collection.id}
              collection={collection}
              updator={updateCollection}
            />
          ))}
        </div>
      )}
    </div>
  );
}
