"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { api } from "~/trpc/react";

import { toast } from "sonner";

import type { TaskCollection as TaskCollectionType } from "~/tasks/types";

import TaskCollection from "~/tasks/components/task-collection";
import TaskCollectionActions from "~/tasks/components/task-collection-actions";

export default function TaskCollectionList({
  collections,
}: {
  collections: TaskCollectionType[];
}) {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);

  const deleteCollectionMutation = api.taskCollection.delete.useMutation({
    onError(err) {
      console.log("Error deleting collection", err);

      toast.error("Error deleting collection");
    },
    onSettled() {
      router.refresh();
    },
  });

  const handleDelete = (id: string) => {
    deleteCollectionMutation.mutate({ ids: [id] });
  };

  return (
    <div className="flex flex-col gap-4">
      <TaskCollectionActions onEditChange={(edit) => setIsEditing(edit)} />

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {collections?.map((collection) => (
          <TaskCollection
            key={collection.id}
            collection={collection}
            editing={isEditing}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
