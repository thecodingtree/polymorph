import { isAfter, isSameDay, isToday, isTomorrow, format } from "date-fns";

import {
  TaskIconTodo,
  TaskIconEvent,
  TaskIconReminder,
} from "~/tasks/components/icons";

import { Badge } from "~/app/_components/ui/badge";

import { TaskPriority, TaskType, type Task } from "~/tasks/types";
import type { Maybe } from "~/types";
import { cn } from "~/lib/utils";

export const getTaskIcon = (
  type: Maybe<TaskType>,
  className?: Maybe<string>,
) => {
  const classes = cn("w-4 h-4", className);

  if (!type) return null;

  switch (type) {
    case TaskType.EVENT:
      return <TaskIconEvent className={classes} />;
    case TaskType.TODO:
      return <TaskIconTodo className={classes} />;
    case TaskType.REMINDER:
      return <TaskIconReminder className={classes} />;
    default:
      return null;
  }
};

const getDayLabel = (date: Date) => {
  if (isToday(date)) {
    return "Today";
  } else if (isTomorrow(date)) {
    return "Tomorrow";
  }
  return format(date, "EEEE");
};

const getSingleDateLabel = (startDate: Maybe<Date>) => {
  // Show date formatted for a Reminder task
  return startDate ? `${format(startDate, "h:mm a, MMMM")}` : "";
};

export const getTaskDateLabel = (task: Task) => {
  if (task.type == TaskType.REMINDER) {
    return getSingleDateLabel(task.startDate);
  }

  return getMultiDateLabel(task.startDate, task.endDate);
};

const getMultiDateLabel = (startDate: Maybe<Date>, endDate: Maybe<Date>) => {
  // Show date formatted for an Event task
  if (startDate && endDate) {
    if (isSameDay(startDate, endDate)) {
      return `${getDayLabel(startDate)}, ${format(startDate, "h:mm a")} - ${format(endDate, "h:mm a")}`;
    }
    return `${getDayLabel(startDate)}, ${format(startDate, "h:mm a")} - ${getDayLabel(endDate)}, ${format(endDate, "h:mm a")}`;
  } else if (startDate) {
    return `${format(startDate, "MMM d")}, ${format(startDate, "h:mm a")}`;
  } else if (endDate) {
    return `${format(endDate, "MMM d")}, ${format(endDate, "h:mm a")}`;
  } else {
    return "";
  }
};

export const getPrioirtyBadge = (priority: TaskPriority) => {
  switch (priority) {
    case TaskPriority.HIGH:
      return (
        <Badge variant="destructive" className="bg-red-500">
          High
        </Badge>
      );
    case TaskPriority.MEDIUM:
      return (
        <Badge variant="default" className="bg-yellow-500">
          Medium
        </Badge>
      );
    case TaskPriority.LOW:
      return (
        <Badge variant="default" className="bg-green-500">
          Low
        </Badge>
      );
    default:
      return null;
  }
};

export const taskSorter = (tasks: Maybe<Task[]>) => {
  return tasks?.sort((a, b) => {
    /***
     * Order by the following:
     * 1. Completed
     * 2. End Date
     * 3. Title
     *
     * If the task is completed, it should be at the bottom of the list
     * If the task has a due date, it should be ordered by the due date
     * If the task has the same due date, it should be ordered by the title
     */
    if (a.completed !== b.completed) {
      if (a.completed) {
        return 1;
      } else {
        return -1;
      }
    }

    if (!isSameDay(a?.endDate ?? new Date(), b?.endDate ?? new Date())) {
      if (isAfter(a?.endDate ?? new Date(), b?.endDate ?? new Date())) {
        return 1;
      } else {
        return -1;
      }
    }

    return a?.title > b?.title ? 1 : -1;
  });
};
