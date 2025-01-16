import TaskList from "../_components/tasks/task-list";

export default async function TasksPage() {
  return (
    <div className="flex flex-col gap-8">
      <TaskList />
    </div>
  );
}
