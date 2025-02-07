import React, { useState } from "react";

import { useMediaQuery } from "usehooks-ts";
import { cn } from "~/lib/utils";
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

export function TaskDetailsDialogTrigger({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={className}>{children}</div>;
}

export function TaskDetailsDialog({
  task,
  taskMutator,
  taskDeletor,
  children,
}: {
  task: Task;
  taskMutator: TaskMutator;
  taskDeletor: TaskDeleter;
  children: React.ReactNode;
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
        <DialogTrigger asChild>
          <li
            className={cn(
              "m-2 cursor-pointer rounded-sm border border-slate-200 bg-slate-50 p-4",
              task?.completed ? "opacity-25" : "",
            )}
          >
            {children}
          </li>
        </DialogTrigger>
        <DialogContent className="">
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
          <Button size={"lg"} variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            size={"lg"}
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
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <li
          className={cn(
            "m-2 cursor-pointer rounded-sm border border-slate-200 bg-slate-50 p-4",
            task?.completed ? "opacity-25" : "",
          )}
        >
          {children}
        </li>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit Task</DrawerTitle>
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
          <DrawerClose asChild>
            <Button size={"lg"} variant="outline">
              Cancel
            </Button>
          </DrawerClose>
          <Button
            size={"lg"}
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
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
