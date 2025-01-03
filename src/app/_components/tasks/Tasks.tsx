"use client";

import { useState } from "react";

import { useToast } from "~/hooks/use-toast";

import { api } from "~/trpc/react";

import type { TaskFilter, Maybe } from "~/types";

import { Button } from "~/app/_components/ui/button";
import { IconAdd, IconDelete } from "~/app/_components/common/icons";

import TasksList from "./TasksList";
import TaskFilters from "./TaskFilters";
import TaskListSkeleton from "./TaskListSkeleton";
import AddTaskDialog from "./AddTaskDialog";
import type { Task } from "@prisma/client";

export default function Tasks() {
  const { toast } = useToast();

  const initialFilters = {
    type: undefined,
    completed: false,
    endDate: new Date(),
  };

  const [filters, setFilters] = useState<TaskFilter>(initialFilters);

  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  const handleSelectChange = (selected: boolean, taskId: string) => {
    if (selected) {
      setSelectedTasks([...selectedTasks, taskId]);
    } else {
      setSelectedTasks(selectedTasks.filter((id) => id !== taskId));
    }
  };

  const { data, isLoading, refetch } = api.task.list.useQuery(filters);

  const updateTasks = api.task.update.useMutation();
  const deleteTasks = api.task.delete.useMutation();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center justify-start gap-4">
        <AddTaskDialog onAdded={() => refetch()}>
          <Button className="rounded-full" size="icon" variant="outline">
            <IconAdd className="h-4 w-4" />
          </Button>
        </AddTaskDialog>
        <Button
          className="rounded-full"
          size="icon"
          variant="outline"
          disabled={selectedTasks.length === 0}
          onClick={() =>
            deleteTasks.mutate(
              { ids: selectedTasks },
              {
                onSettled: () => {
                  refetch().catch(() =>
                    toast({
                      variant: "destructive",
                      description: "Failed to fetch tasks",
                    }),
                  );
                  toast({ description: "Tasks deleted!" });
                  setSelectedTasks([]);
                },
              },
            )
          }
        >
          <IconDelete />
        </Button>
        <TaskFilters
          filters={filters}
          onFilterChange={(filters) => setFilters(filters ?? initialFilters)}
        />
      </div>
      {!isLoading ? (
        <TasksList
          tasks={data as Maybe<Task[]>}
          selectedTasks={selectedTasks}
          onSelectChange={handleSelectChange}
        />
      ) : (
        <TaskListSkeleton />
      )}
      <Button
        disabled={selectedTasks.length === 0}
        onClick={() =>
          updateTasks.mutate(
            { ids: selectedTasks, data: { completed: true } },
            {
              onSettled: () => {
                refetch().catch(() =>
                  toast({
                    variant: "destructive",
                    description: "Failed to fetch tasks",
                  }),
                );
                toast({ description: "Tasks updated!" });
                setSelectedTasks([]);
              },
            },
          )
        }
      >
        Mark Completed
      </Button>
    </div>
  );
}
