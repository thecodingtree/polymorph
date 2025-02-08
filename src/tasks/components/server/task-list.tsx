"use server";

import { api } from "~/trpc/server";
import TaskCollectionList from "~/tasks/components/task-collection-list";

export default async function TaskList() {
  const collections = await api.taskCollection.list({});

  return (
    <div className="mx-2 min-w-96">
      <TaskCollectionList collections={collections} />
    </div>
  );
}
