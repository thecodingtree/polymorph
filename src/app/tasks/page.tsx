import Tasks from "~/app/_components/tasks/Tasks";
import TaskCollections from "../_components/tasks/TaskCollections";

export default async function TasksPage() {
  return (
    <div className="flex flex-col gap-8">
      <TaskCollections />
      <Tasks />
    </div>
  );
}
