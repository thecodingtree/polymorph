"use client";
import { useState } from "react";
import { CircleX, PlusCircle } from "lucide-react";

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
  onDelete,
}: {
  collection: TaskCollection;
  onDelete?: (taskId: string) => void;
}) {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selected, setSelected] = useState(false);

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
    <Card className={cn(selected && "bg-gray-100")}>
      <CardHeader
        className="flex h-16 cursor-pointer flex-row items-center justify-between"
        onClick={() => setSelected(!selected)}
      >
        <CardTitle>{collection.name}</CardTitle>
        {selected && (
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
                <CircleX />
              </Button>
            }
          />
        )}
      </CardHeader>
      <CardContent>
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
