"use client";
import { useState } from "react";
import { PlusCircle, ChevronDown } from "lucide-react";

import { cn } from "~/lib/utils";

import { Button } from "~/app/_components/ui/button";
import { Input } from "~/app/_components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "~/app/_components/ui/card";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "~/app/_components/ui/collapsible";
import { Skeleton } from "~/app/_components/ui/skeleton";

import { type TaskCollection, TaskType } from "~/tasks/types";

import { useTaskApi } from "~/tasks/hooks/useTaskApi";

import TaskItem from "~/tasks/components/task-item";

import { taskSorter } from "~/tasks/utils";

import type { TaskCollectionMutator } from "~/tasks/hooks/useTaskCollectionApi";

export default function TaskCollection({
  collection,
  updator,
}: {
  collection: TaskCollection;
  updator: TaskCollectionMutator;
}) {
  const [newTaskTitle, setNewTaskTitle] = useState("");

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

  const handleOpenChange = (collapsed: boolean) => {
    if (collapsed !== collection.collapsed) {
      updator.mutate({
        ids: [collection.id],
        data: { collapsed },
      });
    }
  };

  return (
    <Collapsible
      open={!collection.collapsed}
      onOpenChange={(open) => handleOpenChange(!open)}
    >
      <Card>
        <CardHeader className="flex h-16 flex-row items-center justify-between">
          <CardTitle className="flex w-full flex-row items-center">
            <span>{collection.name}</span>
          </CardTitle>
          <CollapsibleTrigger>
            <ChevronDown
              className={cn(
                collection.collapsed ? "-rotate-90" : "",
                "h-6 w-6",
              )}
            />
          </CollapsibleTrigger>
        </CardHeader>
        <CardContent className="max-h-96 overflow-y-scroll">
          <CollapsibleContent>
            <div className="mb-4 flex items-center">
              <Input
                type="text"
                placeholder="New Task"
                value={newTaskTitle}
                onFocus={(e) => e.stopPropagation()}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                disabled={isLoading}
                className="mr-2"
              />
              <Button type="button" onClick={handleAddTask} size="sm">
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
            <ul>
              {!isLoading ? (
                taskSorter(tasks)?.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    taskMutator={updateTask}
                    taskDeletor={deleteTask}
                  />
                ))
              ) : (
                <TasksSkeleton />
              )}
            </ul>
          </CollapsibleContent>
        </CardContent>
      </Card>
    </Collapsible>
  );
}

const TasksSkeleton = () => {
  return (
    <div className="border-1 m-2 flex cursor-pointer flex-row items-center justify-between rounded-sm border border-slate-200 p-4">
      <div className="flex flex-row items-center">
        <Skeleton className="h-4 w-4" />

        <Skeleton className="ml-2 h-4 w-28" />
      </div>

      <div className="flex flex-row items-center">
        <Skeleton className="ml-2 h-4 w-28" />
      </div>
    </div>
  );
};
