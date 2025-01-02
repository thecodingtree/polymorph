import { useState } from "react";

import type { z } from "zod";

import { api } from "~/trpc/react";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "~/app/_components/ui/dialog";

import AddTaskForm from "~/app/_components/tasks/AddTaskForm";
import FilterSelect from "~/app/_components/controls/FilterSelect";
import { TaskType, type Task } from "~/types";
import type { TaskCreateSchema } from "~/schemas";

import { getTaskIcon } from "./utils";
import { set } from "date-fns";

export default function AddTaskDialog({
  children,
  onAdded,
}: {
  children: React.ReactNode;
  onAdded?: (task: Task) => void;
}) {
  const [opened, setOpened] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [taskType, setType] = useState<TaskType>(TaskType.TODO);

  const createTask = api.task.create.useMutation();

  const handleSubmit = (values: z.infer<typeof TaskCreateSchema>) => {
    setSubmitting(true);
    createTask.mutate(values, {
      onSuccess: (data) => {
        setOpened(false);
        onAdded?.(data as Task);
      },
      onSettled: () => setSubmitting(false),
    });
  };

  return (
    <Dialog open={opened} onOpenChange={setOpened}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogTitle>Add Task</DialogTitle>
        <FilterSelect
          allowNone={false}
          allowMultiple={false}
          selected={taskType}
          onChange={(type) => setType(type as TaskType)}
          items={Object.values(TaskType).map((type) => ({
            key: type,
            icon: getTaskIcon(type),
          }))}
        />
        <AddTaskForm
          taskType={taskType}
          submitting={submitting}
          onSubmit={(values) => handleSubmit({ ...values, type: taskType })}
        />
      </DialogContent>
    </Dialog>
  );
}
