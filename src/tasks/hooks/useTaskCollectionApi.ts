import { useState } from "react";

import { toast } from "sonner";

import { api } from "~/trpc/react";

import type { TaskCollectionFilter, TaskCollection } from "~/tasks/types";

export function useTaskCollectionApi(filter: TaskCollectionFilter) {
  const [collectionFilters, setCollectionFilters] = useState(filter);
  const utils = api.useUtils();

  const { data: collections, isLoading } =
    api.taskCollection.list.useQuery(collectionFilters);

  const createCollection = api.taskCollection.create.useMutation({
    onMutate: async (newCollection) => {
      // Cancel any ongoing list task queries
      await utils.task.list.cancel();

      // Snapshot the previous value
      const previousCollections =
        utils.taskCollection.list.getData(collectionFilters);

      // Optimistically update the task
      utils.taskCollection.list.setData(collectionFilters, (collections) => {
        const pendingCollection = {
          id: `pending-${Date.now()}`,
          description: null,
          ownerId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          ...newCollection,
        } satisfies TaskCollection;

        return collections
          ? [pendingCollection, ...collections]
          : [pendingCollection];
      });

      return { previousCollections };
    },
    onError(err, _vars, ctx) {
      console.log("Error adding task", err);

      toast.error("Error adding task");

      // Revert the update on error
      utils.taskCollection.list.setData(
        collectionFilters,
        ctx?.previousCollections,
      );
    },
    onSettled() {
      void utils.taskCollection.list.invalidate(collectionFilters);
    },
  });

  const updateCollection = api.taskCollection.update.useMutation({
    async onMutate({ ids, data }) {
      // Cancel any ongoing list task queries
      await utils.taskCollection.list.cancel();

      // Snapshot the previous value
      const previousCollection =
        utils.taskCollection.list.getData(collectionFilters);

      // Optimistically update the task
      utils.taskCollection.list.setData(collectionFilters, (collections) => {
        return collections?.map((collection) => {
          if (ids.includes(collection.id)) {
            return { ...collection, ...data };
          }
          return collection;
        });
      });

      return { previousCollection };
    },
    onError(err, _vars, ctx) {
      console.log("Error updating task", err);

      toast.error("Error updating task");

      // Revert the update on error
      utils.taskCollection.list.setData(
        collectionFilters,
        ctx?.previousCollection,
      );
    },
    onSettled() {
      void utils.taskCollection.list.invalidate(collectionFilters);
    },
  });

  const deleteCollection = api.taskCollection.delete.useMutation({
    onMutate: async (toDelete) => {
      // Cancel any ongoing list task queries
      await utils.taskCollection.list.cancel();

      // Snapshot the previous value
      const previousCollections =
        utils.taskCollection.list.getData(collectionFilters);

      // Optimistically remove the task
      utils.taskCollection.list.setData(collectionFilters, (collections) => {
        collections
          ?.filter((collection) => toDelete?.ids?.includes(collection.id))
          ?.map((collection) => {
            collection.id = `pending-${collection.id}`;
            return collection;
          });

        return collections;
      });

      return { previousCollections };
    },
    onError(err, _vars, ctx) {
      console.log("Error adding task", err);

      toast.error("Error adding task");

      // Revert the update on error
      utils.taskCollection.list.setData(
        collectionFilters,
        ctx?.previousCollections,
      );
    },
    onSettled() {
      void utils.taskCollection.list.invalidate(collectionFilters);
    },
  });

  return {
    createCollection,
    updateCollection,
    deleteCollection,
    collections,
    collectionFilters,
    setCollectionFilters,
    isLoading,
  };
}

export type TaskCollectionMutator = ReturnType<
  typeof useTaskCollectionApi
>[`updateCollection`];
export type TaskCollectionDeleter = ReturnType<
  typeof useTaskCollectionApi
>[`deleteCollection`];
export type TaskCollectionCreator = ReturnType<
  typeof useTaskCollectionApi
>[`createCollection`];
