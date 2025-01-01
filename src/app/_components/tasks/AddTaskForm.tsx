"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import type { z } from "zod";

import { TaskCreateSchema } from "~/schemas";

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

import { Input } from "~/app/_components/ui/input";
import { TaskPriority } from "~/types";
import { Textarea } from "~/app/_components/ui/textarea";
import DateTimePicker from "~/app/_components/controls/DateTime/DateTimePicker";

import { getDateRounded } from "~/app/_components/controls/DateTime/utils";

export default function AddTaskForm({
  submitLabel,
  onSubmit,
  dateType = "dueDate",
  submitting,
}: {
  submitLabel?: string;
  onSubmit: (values: z.infer<typeof TaskCreateSchema>) => void;
  dateType?: "dueDate" | "startDate";
  submitting?: boolean;
}) {
  const form = useForm<z.infer<typeof TaskCreateSchema>>({
    resolver: zodResolver(TaskCreateSchema),
    defaultValues: {
      description: "",
      content: "",
      priority: TaskPriority.LOW,
      isPrivate: false,
      completed: false,
      startDate:
        dateType === "startDate" ? getDateRounded(new Date()) : undefined,
      endDate: getDateRounded(
        dateType === "dueDate"
          ? new Date()
          : new Date(new Date().getHours() + 1),
      ),
    },
  });

  return (
    <div className="m-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Required. Must be at least 1 character."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
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
                  <DateTimePicker
                    date={field.value}
                    onChange={field.onChange}
                  />
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
            name="isPrivate"
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
          <div className="mt-2 flex flex-col justify-center">
            <Button type="submit" disabled={submitting}>
              {submitLabel ?? "Add Task"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
