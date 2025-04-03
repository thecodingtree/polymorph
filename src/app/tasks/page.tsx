import { Suspense } from "react";
import TaskList from "~/tasks/components/server/task-collections";

export default async function TasksPage() {
  return (
    <div className="flex flex-col gap-8">
      <Suspense fallback="Loading...">
        <TaskList />
      </Suspense>
    </div>
  );
}
