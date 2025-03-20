import { Skeleton } from "~/app/_components/ui/skeleton";
import { Card } from "~/app/_components/ui/card";

export default function TaskSkeleton() {
  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <div className="mt-0">
          <Skeleton className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-96" />
            <Skeleton className="h-4 w-8" />
          </div>
          <Skeleton className="mt-1 h-3 w-48" />
        </div>
      </div>
    </Card>
  );
}
