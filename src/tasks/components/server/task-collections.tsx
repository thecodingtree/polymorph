"use server";

import { db } from "~/server/db";

import { getTaskCollections } from "~/task-collection/data";
import TaskCollectionList from "~/tasks/components/task-collection-list";

export default async function TaskCollections() {
  const filter = {};
  const collections = await getTaskCollections({ prisma: db, input: filter });

  return (
    <div className="mx-2 min-w-96">
      <TaskCollectionList filter={filter} collections={collections} />
    </div>
  );
}
