"use client";
import { useState } from "react";
import { CircleX, PlusCircle } from "lucide-react";

import { api } from "~/trpc/react";

import { toast } from "sonner";

import { Button } from "~/app/_components/ui/button";
import { Input } from "~/app/_components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "~/app/_components/ui/card";

import type { TaskCollection, TaskUpdate } from "~/types";
import { TaskPriority, TaskType, type Task } from "~/types";
import TaskItem from "./task-item";
import { cn } from "~/lib/utils";
import { ConfirmDialog } from "~/app/_components/dialogs/confirm-dialog";

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

  const { data: tasks, isLoading } = api.task.list.useQuery(queryFilter);

  const utils = api.useUtils();
  const addTaskMutation = api.task.create.useMutation({
    onMutate: async (newTask) => {
      // Cancel any ongoing list task queries
      await utils.task.list.cancel();

      // Snapshot the previous value
      const previousTasks = utils.task.list.getData(queryFilter);

      // Optimistically update the task
      utils.task.list.setData(queryFilter, (tasks) => {
        const pendingTask = {
          id: `pending-${Date.now()}`,
          collectionId: newTask?.collection,
          description: null,
          ownerId: null,
          entityId: null,
          completed: false,
          private: false,
          startDate: null,
          endDate: null,
          priority: TaskPriority.LOW,
          createdAt: new Date(),
          updatedAt: new Date(),
          ...newTask,
        } satisfies Task;

        return tasks ? [pendingTask, ...tasks] : [pendingTask];
      });

      return { previousTasks };
    },
    onError(err, _vars, ctx) {
      console.log("Error adding task", err);

      toast.error("Error adding task");

      // Revert the update on error
      utils.task.list.setData({}, ctx?.previousTasks);
    },
  });
  const updateTaskMutation = api.task.update.useMutation({
    async onMutate({ ids, data }) {
      // Cancel any ongoing list task queries
      await utils.task.list.cancel();

      // Snapshot the previous value
      const previousTasks = utils.task.list.getData(queryFilter);

      // Optimistically update the task
      utils.task.list.setData(queryFilter, (tasks) => {
        return tasks?.map((task) => {
          if (ids.includes(task.id)) {
            return { ...task, ...data };
          }
          return task;
        });
      });

      return { previousTasks };
    },
    onError(err, _vars, ctx) {
      console.log("Error updating task", err);

      toast.error("Error updating task");

      // Revert the update on error
      utils.task.list.setData({}, ctx?.previousTasks);
    },
  });

  const deleteTaskMutation = api.task.delete.useMutation({
    onMutate: async (toDelete) => {
      // Cancel any ongoing list task queries
      await utils.task.list.cancel();

      // Snapshot the previous value
      const previousTasks = utils.task.list.getData(queryFilter);

      // Optimistically remove the task
      utils.task.list.setData(queryFilter, (tasks) => {
        tasks
          ?.filter((task) => toDelete?.ids?.includes(task.id))
          ?.map((task) => {
            task.id = `pending-${task.id}`;
            return task;
          });

        return tasks;
      });

      return { previousTasks };
    },
    onError(err, _vars, ctx) {
      console.log("Error adding task", err);

      toast.error("Error adding task");

      // Revert the update on error
      utils.task.list.setData({}, ctx?.previousTasks);
    },
  });

  const updateTask = (taskId: string, taskData: TaskUpdate) => {
    updateTaskMutation.mutate(
      { ids: [taskId], data: taskData },
      {
        onSuccess: () => {
          void utils.task.list.invalidate(queryFilter);
        },
      },
    );
  };

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      const newTask = {
        type: TaskType.TODO,
        title: newTaskTitle.trim(),
        collection: collection.id,
      };

      addTaskMutation.mutate(newTask, {
        onSuccess: () => {
          void utils.task.list.invalidate(queryFilter);
        },
      });
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
            <li>
              {tasks?.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onChecked={(checked) =>
                    updateTask(task.id, { completed: checked })
                  }
                  onDelete={(taskId) => {
                    deleteTaskMutation.mutate(
                      { ids: [taskId] },
                      {
                        onSettled: () => {
                          void utils.task.list.invalidate(queryFilter);
                        },
                      },
                    );
                  }}
                />
              ))}
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
