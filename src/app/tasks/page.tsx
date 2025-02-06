import TaskList from "~/tasks/components/server/task-list";

export default async function TasksPage() {
  return (
    <div className="flex flex-col gap-8">
      <TaskList />
    </div>
  );
}
