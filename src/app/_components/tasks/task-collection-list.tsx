"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { api } from "~/trpc/react";

import { toast } from "sonner";

import type { TaskCollection as TaskCollectionType } from "~/types";

import TaskCollection from "~/app/_components/tasks/task-collection";
import { set } from "date-fns";

export default function TaskCollectionList({
  collections,
}: {
  collections: TaskCollectionType[];
}) {
  const router = useRouter();

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
    <>
      {collections?.map((collection) => (
        <TaskCollection
          key={collection.id}
          collection={collection}
          onDelete={handleDelete}
        />
      ))}
    </>
  );
}
