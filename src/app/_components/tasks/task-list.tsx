"use client";

import { useState } from "react";
import { PlusCircle, LayoutGrid, List } from "lucide-react";

import { api } from "~/trpc/react";

import { Button } from "~/app/_components/ui/button";
import { Input } from "~/app/_components/ui/input";
import TaskCollection from "./task-collection";
import TaskListView from "./task-list-view";

import type { TaskUpdate } from "~/types";
import { type TaskCreateSchema } from "~/schemas";

import { type z } from "zod";

export default function TaskList() {
  const [viewMode, setViewMode] = useState<"card" | "list">("card");

  const { data: collections, refetch } = api.taskCollection.list.useQuery({});

  const addTaskMutation = api.task.create.useMutation();
  const updateTaskMutation = api.task.update.useMutation();

  const addCollection = () => {
    // if (newCollectionName.trim()) {
    //   setCollections([
    //     ...collections,
    //     {
    //       id: Date.now().toString(),
    //       name: newCollectionName.trim(),
    //       tasks: [],
    //     },
    //   ]);
    //   setNewCollectionName("");
    // }
  };

  const addTask = (
    collectionId: string,
    task: z.infer<typeof TaskCreateSchema>,
  ) => {
    console.log("addTask", collectionId, task);
    const newTask = {
      ...task,
      collection: collectionId,
    };

    addTaskMutation.mutate(newTask, {
      onSuccess: () => {
        void refetch();
      },
    });
  };

  const updateTask = (_: string, taskId: string, taskUpdate: TaskUpdate) => {
    updateTaskMutation.mutate(
      { ids: [taskId], data: taskUpdate },
      {
        onSuccess: () => {
          void refetch();
        },
      },
    );
  };

  return (
    <div className="mx-2 min-w-96">
      <h1 className="mb-6 text-3xl font-bold">Task List</h1>
      <div className="mb-6 flex items-center">
        <Input
          type="text"
          placeholder="New Collection Name"
          //value={newCollectionName}
          //onChange={(e) => setNewCollectionName(e.target.value)}
          className="mr-2"
        />
        <Button onClick={addCollection}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Collection
        </Button>
      </div>
      <div className="mb-4 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setViewMode(viewMode === "card" ? "list" : "card")}
        >
          {viewMode === "card" ? (
            <List className="mr-2 h-4 w-4" />
          ) : (
            <LayoutGrid className="mr-2 h-4 w-4" />
          )}
          {viewMode === "card" ? "List View" : "Card View"}
        </Button>
      </div>
      {viewMode === "card" ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {collections?.map((collection) => (
            <TaskCollection
              key={collection.id}
              collection={collection}
              addTask={addTask}
              updateTask={updateTask}
            />
          ))}
        </div>
      ) : (
        <TaskListView
          collections={collections ?? []}
          addTask={addTask}
          updateTask={updateTask}
        />
      )}
    </div>
  );
}
