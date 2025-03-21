"use client";

import { isBefore, isToday, isThisYear, format } from "date-fns";
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "~/lib/utils";
import { Card } from "~/app/_components/ui/card";
import { Badge } from "~/app/_components/ui/badge";
import { Button } from "~/app/_components/ui/button";

import { type Task, TaskPriority } from "~/tasks/types";

import { completeTask } from "~/tasks/actions";

export default function Task({ task }: { task: Task }) {
  const isDueToday = task?.endDate && isToday(task?.endDate);
  const isOverdue =
    task?.endDate && !isDueToday && isBefore(task?.endDate, new Date());

  const dueDateFormat = isDueToday
    ? "h:mm a"
    : isThisYear(task.endDate!)
      ? "EEEE, MMMM d"
      : "EEEE, MMMM d yyyy";

  return (
    <Card
      key={task?.id}
      className={cn(
        "p-4",
        isOverdue ? "text-red-400" : "",
        task?.completed ? "line-through" : "",
      )}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0">
          {task?.completed ? (
            <CheckCircle2 className="h-5 w-5 text-primary" />
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="m-0 h-5 w-5 cursor-pointer rounded-xl p-0"
              onClick={() => completeTask(task.id)}
              asChild
            >
              <Circle className="text-muted-foreground" />
            </Button>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="font-medium">{task.title}</p>
            <PriorityBadge priority={task.priority} />
          </div>
          {!isDueToday && (
            <p className="mt-1 text-sm text-muted-foreground">
              {format(task.endDate!, dueDateFormat)}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

// Helper component for priority badges
function PriorityBadge({ priority }: { priority: string }) {
  const getColor = () => {
    switch (priority) {
      case TaskPriority.HIGH:
        return "bg-destructive/10 text-destructive hover:bg-destructive/20";
      case TaskPriority.MEDIUM:
        return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      case TaskPriority.LOW:
        return "bg-green-100 text-green-800 hover:bg-green-200";
      default:
        return "bg-secondary text-secondary-foreground hover:bg-secondary/80";
    }
  };

  return (
    <Badge variant="outline" className={`ml-2 ${getColor()}`}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </Badge>
  );
}
