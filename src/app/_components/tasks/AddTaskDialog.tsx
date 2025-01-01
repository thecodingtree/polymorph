import { useState } from "react";

import { api } from "~/trpc/react";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "~/app/_components/ui/dialog";

import AddTaskForm from "~/app/_components/tasks/AddTaskForm";
import FilterSelect from "~/app/_components/controls/FilterSelect";
import { type Task } from "~/types";
import { TaskType } from "~/types";

import { getTaskIcon } from "./utils";

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

  //const createTask = trpc.task.createTask.useMutation();

  const handleSubmit = (values: Task) => {
    createTask.mutate(values, {
      onSuccess: (data) => {
        setOpened(false);
        onAdded?.(data as Task);
      },
      onSettled: () => setSubmitting(false),
    });
  };

  return (
    <div>
      <Dialog open={opened} onOpenChange={setOpened}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <FilterSelect
            allowNone={false}
            allowMultiple={false}
            selected={type}
            onChange={(type) => setType(type as TaskType)}
            items={Object.values(TaskType).map((type) => ({
              key: type,
              icon: getTaskIcon(type),
            }))}
          />
          <AddTaskForm
            submitting={submitting}
            onSubmit={(values) => handleSubmit({ ...values, type: type! })}
            dateType={type === TaskType.EVENT ? "startDate" : "dueDate"}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
