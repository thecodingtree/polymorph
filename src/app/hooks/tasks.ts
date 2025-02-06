import React, { useState } from "react";

import { toast } from "sonner";

import { api } from "~/trpc/react";

import { type Task, TaskPriority, type TaskFilter } from "~/types";

export function useTaskApi(filter: TaskFilter) {
  const [taskFilter, setTaskFilter] = useState(filter);

  const utils = api.useUtils();

  const { data: tasks, isLoading } = api.task.list.useQuery(taskFilter);

  const createTask = api.task.create.useMutation({
    onMutate: async (newTask) => {
      // Cancel any ongoing list task queries
      await utils.task.list.cancel();

      // Snapshot the previous value
      const previousTasks = utils.task.list.getData(taskFilter);

      // Optimistically update the task
      utils.task.list.setData(taskFilter, (tasks) => {
        const pendingTask = {
          id: `pending-${Date.now()}`,
          collectionId: newTask?.collection,
          description: null,
          ownerId: null,
          entityId: null,
          completed: false,
          private: false,
          startDate: null,
          endDate: new Date(),
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
      utils.task.list.setData(taskFilter, ctx?.previousTasks);
    },
    onSettled() {
      void utils.task.list.invalidate(taskFilter);
    },
  });

  const updateTask = api.task.update.useMutation({
    async onMutate({ ids, data }) {
      // Cancel any ongoing list task queries
      await utils.task.list.cancel();

      // Snapshot the previous value
      const previousTasks = utils.task.list.getData(taskFilter);

      // Optimistically update the task
      utils.task.list.setData(taskFilter, (tasks) => {
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
      utils.task.list.setData(taskFilter, ctx?.previousTasks);
    },
    onSettled() {
      void utils.task.list.invalidate(taskFilter);
    },
  });

  const deleteTask = api.task.delete.useMutation({
    onMutate: async (toDelete) => {
      // Cancel any ongoing list task queries
      await utils.task.list.cancel();

      // Snapshot the previous value
      const previousTasks = utils.task.list.getData(taskFilter);

      // Optimistically remove the task
      utils.task.list.setData(taskFilter, (tasks) => {
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
      utils.task.list.setData(filter, ctx?.previousTasks);
    },
    onSettled() {
      void utils.task.list.invalidate(taskFilter);
    },
  });

  return {
    createTask,
    updateTask,
    deleteTask,
    tasks,
    taskFilter,
    setTaskFilter,
    isLoading,
  };
}

export type TaskMutator = ReturnType<typeof useTaskApi>[`updateTask`];
export type TaskDeleter = ReturnType<typeof useTaskApi>[`deleteTask`];
export type TaskCreator = ReturnType<typeof useTaskApi>[`createTask`];
