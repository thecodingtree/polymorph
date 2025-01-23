import { Checkbox } from "~/app/_components/ui/checkbox";

import { cn } from "~/lib/utils";

import type { Task } from "~/types";

export default function TaskItem({
  task,
  onChecked,
}: {
  task: Task;
  onChecked?: (checked: boolean) => void;
}) {
  const isPending = task.id.includes("pending");

  return (
    <div
      className={cn(
        "flex items-center space-x-2 p-2",
        isPending && "opacity-50",
      )}
    >
      <Checkbox
        checked={task.completed}
        onCheckedChange={onChecked}
        disabled={isPending}
      />
      <span className="ml-2">{task?.title}</span>
    </div>
  );
}
