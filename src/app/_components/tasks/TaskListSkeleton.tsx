import { Skeleton } from "~/app/_components/ui/skeleton";

export default function TaskListSkeleton() {
  const TaskItemSkeleton = () => {
    return (
      <div className="flex items-center space-x-4">
        <Skeleton className="h-4 w-4 rounded-full" />
        <div className="flex flex-row space-y-2">
          <Skeleton className="h-4 w-[250px]" />
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <TaskItemSkeleton />
      <TaskItemSkeleton />
      <TaskItemSkeleton />
    </div>
  );
}
