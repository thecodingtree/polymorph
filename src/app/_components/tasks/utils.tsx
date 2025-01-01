import { TaskIconTodo } from "./icons";

import { Badge } from "~/app/_components/ui/badge";

import { TaskPriority, TaskType, type Maybe } from "~/types";
import { cn } from "~/lib/utils";

export const getTaskIcon = (
  type: Maybe<TaskType>,
  className?: Maybe<string>,
) => {
  const classes = cn("w-4 h-4", className);

  if (!type) return null;

  if (type === TaskType.TODO) {
    return <TaskIconTodo className={classes} />;
  }

  // switch (type) {
  //   // case TaskType.CALL:
  //   //   return <TaskIconCall className={classes} />;
  //   // case TaskType.EMAIL:
  //   //   return <TaskIconEmail className={classes} />;
  //   // case TaskType.EVENT:
  //   //   return <TaskIconEvent className={classes} />;
  //   // case TaskType.FOLLOW_UP:
  //   //   return <TaskIconFolllowUp className={classes} />;
  //   case type === TaskType.TODO:
  //     return <TaskIconTodo className={classes} />;
  //   // case TaskType.OTHER:
  //   //   return <TaskIconOther className={classes} />;
  //   default:
  //     return null;
  // }
};

export const getTaskDateLabel = (
  endDate: Maybe<Date>,
  startDate: Maybe<Date>,
) => {
  if (startDate) {
    return `${startDate.toLocaleTimeString()} - ${endDate?.toLocaleTimeString()}`;
  } else if (!endDate) {
    return "No due date";
  }

  const now = new Date();

  switch (endDate.getDate() - now.getDate()) {
    case 0:
      return "Today";
    case 1:
      return "Tomorrow";
    default:
      return endDate?.toLocaleDateString();
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
