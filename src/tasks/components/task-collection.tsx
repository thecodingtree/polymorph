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

import { type TaskCollection, TaskType } from "~/tasks/types";

import TaskItem from "~/tasks/components/task-item";

import { taskSorter } from "~/tasks/utils";
import { useTaskApi } from "~/tasks/hooks/useTaskApi";

import type { TaskCollectionMutator } from "~/tasks/hooks/useTaskCollectionApi";

export default function TaskCollection({
  key,
  collection,
  updator,
}: {
  key: string;
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
      <Card key={key}>
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
              {taskSorter(tasks)?.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  taskMutator={updateTask}
                  taskDeletor={deleteTask}
                />
              ))}
            </ul>
          </CollapsibleContent>
        </CardContent>
      </Card>
    </Collapsible>
  );
}
