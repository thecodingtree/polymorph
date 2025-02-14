"use server";

import TaskCollectionList from "~/tasks/components/task-collection-list";

export default async function TaskList() {
  const collectionsFilter = {};

  return (
    <div className="mx-2 min-w-96">
      <TaskCollectionList filter={collectionsFilter} />
    </div>
  );
}
