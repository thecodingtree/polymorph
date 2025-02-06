"use client";

import { useRouter } from "next/navigation";

import { api } from "~/trpc/react";

import { toast } from "sonner";

import type { TaskCollection as TaskCollectionType } from "~/tasks/types";

import TaskCollection from "~/tasks/components/task-collection";

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
