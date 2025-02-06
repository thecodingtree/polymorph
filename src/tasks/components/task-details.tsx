import React, { useState } from "react";

import { useMediaQuery } from "usehooks-ts";
import { Button } from "~/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/app/_components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/app/_components/ui/drawer";

import TaskForm from "~/tasks/components/form/task-form";

import type { Task, TaskUpdate } from "~/tasks/types";

import type { TaskMutator, TaskDeleter } from "~/tasks/hooks/useTaskApi";

export function TaskDetails({
  task,
  trigger,
  taskMutator,
  taskDeletor,
}: {
  task: Task;
  trigger: React.ReactNode;
  taskMutator: TaskMutator;
  taskDeletor: TaskDeleter;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const handleSubmit = (taskUpdate: TaskUpdate) => {
    setIsPending(true);
    taskMutator.mutate(
      { ids: [task.id], data: taskUpdate },
      {
        onSettled: () => {
          setIsPending(false);
          setOpen(false);
        },
      },
    );
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Make changes to your task here. Click save when you done.
            </DialogDescription>
          </DialogHeader>

          <TaskForm
            task={task}
            onSubmit={handleSubmit}
            submitting={isPending}
          />
          <Button
            variant="destructive"
            onClick={() =>
              taskDeletor.mutate(
                { ids: [task.id] },
                { onSettled: () => setOpen(false) },
              )
            }
          >
            Delete
          </Button>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit profile</DrawerTitle>
          <DrawerDescription>
            Make changes to your profile here. Click save when you done.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4">
          <TaskForm
            task={task}
            onSubmit={handleSubmit}
            submitting={isPending}
          />
        </div>
        <DrawerFooter className="pt-2">
          <Button
            variant="destructive"
            onClick={() =>
              taskDeletor.mutate(
                { ids: [task.id] },
                { onSettled: () => setOpen(false) },
              )
            }
          >
            Delete
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
