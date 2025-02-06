import { useState } from "react";

import { getTaskDateLabel } from "~/app/_components/tasks/utils";

import { Checkbox } from "~/app/_components/ui/checkbox";

import { cn } from "~/lib/utils";

import type { Task } from "~/types";
import { TaskDetails } from "./task-details";

import type { TaskMutator, TaskDeleter } from "~/app/hooks/tasks";

export default function TaskItem({
  task,
  taskMutator,
  taskDeletor,
}: {
  task: Task;
  taskMutator: TaskMutator;
  taskDeletor: TaskDeleter;
}) {
  const isPending = task.id.includes("pending");

  return (
    <li className="cursor-pointer">
      <TaskDetails
        task={task}
        trigger={
          <div
            className={cn(
              "flex h-8 items-center space-x-2",
              isPending ? "opacity-50" : "",
            )}
          >
            <Checkbox
              checked={task.completed}
              onClick={(e) => {
                e.stopPropagation();
              }}
              onCheckedChange={(checked) =>
                taskMutator.mutate({
                  ids: [task.id],
                  data: { completed: checked === true },
                })
              }
              disabled={isPending}
            />
            <span
              className={cn(
                "ml-2 flex-1 flex-nowrap text-ellipsis text-left",
                task?.completed ? "line-through" : "",
              )}
            >
              {task?.title}
            </span>
            <span className={cn("ml-2 text-right text-xs text-slate-500")}>
              {getTaskDateLabel(task?.endDate, task?.startDate)}
            </span>
          </div>
        }
        taskMutator={taskMutator}
        taskDeletor={taskDeletor}
      />
    </li>
  );
}
