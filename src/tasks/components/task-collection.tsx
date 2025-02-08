"use client";
import { useState } from "react";
import { Trash, PlusCircle, Grip, Check } from "lucide-react";

import { Button } from "~/app/_components/ui/button";
import { Input } from "~/app/_components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "~/app/_components/ui/card";

import { ConfirmDialog } from "~/app/_components/dialogs/confirm-dialog";

import { type TaskCollection, TaskType } from "~/tasks/types";

import TaskItem from "~/tasks/components/task-item";
import { cn } from "~/lib/utils";

import { taskSorter } from "~/tasks/utils";
import { useTaskApi } from "~/tasks/hooks/useTaskApi";

export default function TaskCollection({
  collection,
  editing,
  onDelete,
}: {
  collection: TaskCollection;
  editing: boolean;
  onDelete?: (taskId: string) => void;
}) {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [collectionTitle, setCollectionTitle] = useState(collection.name);
  const [isPending, setIsPending] = useState(false);

  const queryFilter = {
    collection: [collection.id],
  };

  const { createTask, updateTask, deleteTask, tasks, isLoading } =
    useTaskApi(queryFilter);

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      const newTask = {
        type: TaskType.TODO,
        title: newTaskTitle.trim(),
        collection: collection.id,
      };

      createTask.mutate(newTask);
      setNewTaskTitle("");
    }
  };

  return (
    <Card className={cn(editing && "bg-gray-100")}>
      <CardHeader className="flex h-16 cursor-pointer flex-row items-center justify-between">
        <CardTitle className="flex w-full flex-row items-center">
          {editing ? (
            <>
              <Grip className="mr-2 h-6 w-6" />
              <Input
                className="w-full bg-white"
                defaultValue={collectionTitle}
                onChange={(e) => setCollectionTitle(e.target.value)}
                disabled={isPending}
              />
            </>
          ) : (
            <span>{collectionTitle}</span>
          )}
        </CardTitle>
        {editing && (
          <div className="flex flex-row">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                setIsPending(true);
                updateTask.mutate(
                  {
                    ids: [collection.id],
                    data: { title: collectionTitle },
                  },
                  { onSettled: () => setIsPending(false) },
                );
              }}
            >
              <Check />
            </Button>
            <ConfirmDialog
              title="Are you sure you want to delete this collection?"
              description="This can not be undone"
              onConfirm={() => onDelete?.(collection.id)}
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Trash />
                </Button>
              }
            />
          </div>
        )}
      </CardHeader>
      <CardContent
        className={cn(editing && "hidden", "max-h-96 overflow-y-scroll")}
      >
        <div className="mb-4 flex items-center">
          <Input
            type="text"
            placeholder="New Task"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            disabled={isLoading}
            className="mr-2"
          />
          <Button type="button" onClick={handleAddTask} size="sm">
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2">
          <ul>
            {taskSorter(tasks)?.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                taskMutator={updateTask}
                taskDeletor={deleteTask}
              />
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
