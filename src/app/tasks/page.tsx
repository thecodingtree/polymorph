import { api } from "~/trpc/server";

import TasksList from "~/app/_components/tasks/TasksList";

export default async function Tasks() {
  const tasks = await api.task.list({});

  return <TasksList tasks={tasks} selectedTasks={[]} />;
}
