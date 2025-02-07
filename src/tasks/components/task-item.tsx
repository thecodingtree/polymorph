import { getTaskDateLabel } from "~/tasks/utils";

import { Checkbox } from "~/app/_components/ui/checkbox";

import { cn } from "~/lib/utils";

import type { Task } from "~/tasks/types";
import {
  TaskDetailsDialog,
  TaskDetailsDialogTrigger,
} from "~/tasks/components/task-details";

import type { TaskMutator, TaskDeleter } from "~/tasks/hooks/useTaskApi";

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
    <TaskDetailsDialog
      task={task}
      taskMutator={taskMutator}
      taskDeletor={taskDeletor}
    >
      <TaskDetailsDialogTrigger
        className={cn(
          "flex max-h-10 flex-col align-middle text-slate-700",
          isPending ? "opacity-50" : "",
        )}
      >
        <p className="flex flex-row items-center">
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
              "ml-2 flex-1 flex-nowrap text-ellipsis text-left font-bold",
              task?.completed ? "line-through" : "",
            )}
          >
            {task?.title}
          </span>
          <span className={cn("ml-2 text-right text-xs text-slate-500")}>
            {getTaskDateLabel(task?.endDate, task?.startDate)}
          </span>
        </p>
        {(task?.description?.length ?? 0) > 0 && (
          <p className="ml-0 max-w-full truncate text-xs text-slate-500">
            {task?.description}
          </p>
        )}
      </TaskDetailsDialogTrigger>
    </TaskDetailsDialog>
  );
}
