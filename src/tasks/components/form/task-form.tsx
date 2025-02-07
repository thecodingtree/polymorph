"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import type { z } from "zod";

import { TaskUpdateSchema } from "~/tasks/schemas";

import { Button } from "~/app/_components/ui/button";
import { Switch } from "~/app/_components/ui/switch";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/app/_components/ui/select";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "~/app/_components/ui/form";

import type { Task, TaskUpdate } from "~/tasks/types";
import { TaskPriority, TaskType } from "~/tasks/types";
import { Textarea } from "~/app/_components/ui/textarea";
import { Input } from "~/app/_components/ui/input";
import DateTimePicker from "~/app/_components/controls/DateTime/DateTimePicker";

import { getDateRounded } from "~/app/_components/controls/DateTime/utils";

export default function TaskForm({
  task,
  submitLabel,
  onSubmit,
  submitting,
}: {
  task: Task;
  submitLabel?: string;
  onSubmit: (values: TaskUpdate) => void;
  dateType?: "dueDate" | "startDate";
  submitting?: boolean;
}) {
  const dateType = task?.type === TaskType.EVENT ? "startDate" : "dueDate";

  const form = useForm<z.infer<typeof TaskUpdateSchema>>({
    resolver: zodResolver(TaskUpdateSchema),
    defaultValues: {
      type: task.type,
      description: task.description ?? "",
      title: task.title ?? "",
      priority: task.priority,
      private: task.private,
      completed: task.completed,
      startDate:
        dateType === "startDate"
          ? getDateRounded(task.startDate ?? new Date())
          : undefined,
      endDate: task.endDate
        ? getDateRounded(task.endDate)
        : getDateRounded(
            dateType === "dueDate"
              ? new Date()
              : new Date(new Date().getHours() + 1),
          ),
    },
  });

  const { isDirty, isValid } = form.formState;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {dateType === "startDate" && (
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <DateTimePicker date={field.value} onChange={field.onChange} />
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>
                {dateType == "dueDate" ? "Due Date" : "End Date"}
              </FormLabel>
              <DateTimePicker date={field.value} onChange={field.onChange} />
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={TaskPriority.LOW}>
                    {TaskPriority.LOW}
                  </SelectItem>
                  <SelectItem value={TaskPriority.MEDIUM}>
                    {TaskPriority.MEDIUM}
                  </SelectItem>
                  <SelectItem value={TaskPriority.HIGH}>
                    {TaskPriority.HIGH}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="private"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Private</FormLabel>
                <FormDescription>
                  This will hide the task from other users.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="completed"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Completed</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="mt-2 flex flex-col justify-center">
          <Button
            size={"lg"}
            type="submit"
            disabled={!isDirty || !isValid || submitting}
          >
            {submitLabel ?? "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
