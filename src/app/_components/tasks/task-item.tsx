"use client";

import { useState } from "react";
import { Checkbox } from "~/app/_components/ui/checkbox";
import { Button } from "~/app/_components/ui/button";

import { api } from "~/trpc/react";

import UpdateTaskDialog from "./task-update-dialog";

import type { Task, TaskUpdate } from "~/types";
import { toast } from "sonner";

export default function TaskItem({ task }: { task: Task }) {
  const [taskData, setTaskData] = useState<Task>(task);

  const mutateTask = api.task.update.useMutation();

  const updateTask = (taskId: string, updates: TaskUpdate) => {
    const curTask = taskData;

    setTaskData({ ...taskData, ...updates });

    mutateTask.mutate(
      {
        ids: [taskId],
        data: updates,
      },
      {
        onSuccess: () => {
          setTaskData({ ...taskData, ...updates });
        },
        onError: (error) => {
          console.error("Error updating task", error);
          toast.error("Error updating task");
          setTaskData(curTask);
        },
      },
    );
  };

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        checked={taskData.completed}
        onCheckedChange={(checked) =>
          updateTask(taskData.id, { completed: checked as boolean })
        }
      />
      <UpdateTaskDialog task={taskData} onUpdate={updateTask}>
        <Button variant="ghost" className="flex-grow justify-start">
          <span className={taskData?.completed ? "line-through" : ""}>
            {taskData?.title}
          </span>
        </Button>
      </UpdateTaskDialog>
    </div>
  );
}
