import { Checkbox } from "~/app/_components/ui/checkbox";
import { Button } from "~/app/_components/ui/button";

import UpdateTaskDialog from "./task-update-dialog";

import type { Task, TaskUpdate } from "~/types";

export default function TaskItem({
  task,
  updateTask,
}: {
  task: Task;
  updateTask: (taskId: string, updates: TaskUpdate) => void;
}) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        checked={task.completed}
        onCheckedChange={(checked) =>
          updateTask(task.id, { completed: checked as boolean })
        }
      />
      <UpdateTaskDialog task={task} onUpdate={updateTask}>
        <Button variant="ghost" className="flex-grow justify-start">
          <span className={task.completed ? "line-through" : ""}>
            {task?.title}
          </span>
        </Button>
      </UpdateTaskDialog>
    </div>
  );
}
