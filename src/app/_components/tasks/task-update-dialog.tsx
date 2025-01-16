import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "~/app/_components/ui/dialog";

import TaskForm from "~/app/_components/tasks/form/TaskForm";
//import FilterSelect from "~/app/_components/controls/FilterSelect";
import { type Task, type TaskUpdate } from "~/types";

export default function UpdateTaskDialog({
  task,
  children,
  onUpdate,
}: {
  task: Task;
  children?: React.ReactNode;
  onUpdate?: (taskId: string, task: TaskUpdate) => void;
}) {
  const [opened, setOpened] = useState(false);
  return (
    <Dialog open={opened} onOpenChange={setOpened}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogTitle>Edit</DialogTitle>
        {/* <FilterSelect
          allowNone={false}
          allowMultiple={false}
          selected={task.type}
          onChange={(type) => (task = { ...task, type: type as TaskType })}
          items={Object.values(TaskType).map((type) => ({
            key: type,
            icon: getTaskIcon(type),
          }))}
        /> */}
        <TaskForm
          task={task}
          submitLabel="Save"
          onSubmit={(update) => (onUpdate?.(task.id, update), setOpened(false))}
        />
      </DialogContent>
    </Dialog>
  );
}
