import React, { useState } from "react";

import { useMediaQuery } from "usehooks-ts";
import { cn } from "~/lib/utils";
import { Button } from "~/app/_components/ui/button";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/app/_components/ui/sheet";
import { ScrollArea } from "~/app/_components/ui/scroll-area";

import TaskForm from "~/tasks/components/form/task-form";

import type { Task, TaskUpdate } from "~/tasks/types";
import type { Maybe } from "~/types";

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
  defaultOpen,
  onOpenChange,
  children,
}: {
  task: Maybe<Task>;
  taskMutator?: TaskMutator;
  taskDeletor?: TaskDeleter;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  const [isPending, setIsPending] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const handleSubmit = (id: string, taskUpdate: TaskUpdate) => {
    console.log("taskUpdate", taskUpdate);
    setIsPending(true);
    taskMutator?.mutate(
      { ids: [id], data: taskUpdate },
      {
        onSettled: () => {
          setIsPending(false);
          setOpen(false);
        },
      },
    );
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    onOpenChange?.(open);
  };

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={handleOpenChange}>
        {children && (
          <SheetTrigger asChild>
            <li
              className={cn(
                "m-2 cursor-pointer rounded-sm border border-slate-200 bg-slate-50 p-4",
                task?.completed ? "opacity-25" : "",
              )}
            >
              {children}
            </li>
          </SheetTrigger>
        )}

        <SheetContent className="flex flex-col p-0 sm:max-w-lg" dir="right">
          <SheetHeader className="p-4">
            <SheetTitle>{task?.title}</SheetTitle>
            <SheetDescription>
              Make changes to your task here. Click save when you done.
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="p-4">
            {task && (
              <TaskForm
                task={task}
                onSubmit={(update) => handleSubmit(task.id, update)}
                submitting={isPending}
              />
            )}
            <div className="mt-2 flex flex-col gap-2">
              <Button
                size={"lg"}
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                size={"lg"}
                variant="destructive"
                onClick={() => {
                  if (!task) return;
                  taskDeletor?.mutate(
                    { ids: [task.id] },
                    { onSettled: () => setOpen(false) },
                  );
                }}
              >
                Delete
              </Button>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer snapPoints={[0.9]} open={open} onOpenChange={handleOpenChange}>
      {children && (
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
      )}

      <DrawerContent className="">
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit Task</DrawerTitle>
          <DrawerDescription>
            Make changes to your profile here. Click save when you done.
          </DrawerDescription>
        </DrawerHeader>
        <ScrollArea>
          <div className="p-4">
            {task && (
              <TaskForm
                task={task}
                onSubmit={(update) => handleSubmit(task.id, update)}
                submitting={isPending}
              />
            )}
          </div>
        </ScrollArea>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button size={"lg"} variant="outline">
              Cancel
            </Button>
          </DrawerClose>
          <Button
            size={"lg"}
            variant="destructive"
            onClick={() => {
              if (!task) return;
              taskDeletor?.mutate(
                { ids: [task?.id] },
                { onSettled: () => setOpen(false) },
              );
            }}
          >
            Delete
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
