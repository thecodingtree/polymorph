"use server";

import { Suspense } from "react";

import { api } from "~/trpc/server";

import TaskCollectionCreate from "./task-collection-create";
import TaskCollection from "./task-collection";

export default async function TaskList() {
  const collections = await api.taskCollection.list({});

  return (
    <div className="mx-2 min-w-96">
      <TaskCollectionCreate />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Suspense fallback={<div>Loading...</div>}>
          {collections?.map((collection) => (
            <TaskCollection key={collection.id} collection={collection} />
          ))}
        </Suspense>
      </div>
    </div>
  );
}
