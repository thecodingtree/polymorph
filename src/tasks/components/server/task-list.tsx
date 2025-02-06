"use server";

import { Suspense } from "react";

import { api } from "~/trpc/server";

import TaskCollectionCreate from "~/tasks/components/task-collection-create";
import TaskCollectionList from "~/tasks/components/task-collection-list";

export default async function TaskList() {
  const collections = await api.taskCollection.list({});

  return (
    <div className="mx-2 min-w-96">
      <TaskCollectionCreate />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Suspense fallback={<div>Loading...</div>}>
          <TaskCollectionList collections={collections} />
        </Suspense>
      </div>
    </div>
  );
}
