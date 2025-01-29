import { useState } from "react";

import { CircleX } from "lucide-react";

import { Checkbox } from "~/app/_components/ui/checkbox";
import { Button } from "~/app/_components/ui/button";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/app/_components/ui/collapsible";

import { cn } from "~/lib/utils";

import type { Task } from "~/types";

export default function TaskItem({
  task,
  onChecked,
  onDelete,
}: {
  task: Task;
  onChecked?: (checked: boolean) => void;
  onDelete?: (taskId: string) => void;
}) {
  const [opened, setOpened] = useState(false);

  const isPending = task.id.includes("pending");

  return (
    <Collapsible className="w-full" onOpenChange={setOpened}>
      <CollapsibleTrigger
        asChild
        className="w-full"
        onClick={(e) => e.stopPropagation()}
      >
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
            onCheckedChange={onChecked}
            disabled={isPending}
          />
          <span
            className={cn(
              "ml-2 flex-1 text-left",
              task?.completed ? "line-through" : "",
            )}
          >
            {task?.title}
          </span>
          {opened && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(task.id);
              }}
            >
              <CircleX />
            </Button>
          )}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>Open</CollapsibleContent>
    </Collapsible>
  );
}
