"use server";

import { api } from "~/trpc/server";

import { db } from "~/server/db";

import { getTasks } from "~/tasks/data";

import type { TaskFilter } from "~/tasks/types";

import Task from "~/landing/task";

export default async function TasksContainer({
  filter,
  emptyMsg,
}: {
  filter: TaskFilter;
  emptyMsg?: string;
}) {
  const tasks = await getTasks({ prisma: db, input: filter });

  return (
    <div className="grid gap-4">
      {tasks?.length === 0 ? (
        <p className="text-muted-foreground">{emptyMsg ?? "No tasks found."}</p>
      ) : (
        tasks?.map((task) => <Task key={task.id} task={task} />)
      )}
    </div>
  );
}
