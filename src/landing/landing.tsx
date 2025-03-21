import React, { Suspense } from "react";

import { format, addMonths, endOfToday, startOfTomorrow } from "date-fns";
import { CalendarDays } from "lucide-react";

import TaskSkeleton from "~/landing/task-skeleton";
import TasksContainer from "~/landing/task-container";

export default async function Landing() {
  // Get today's date
  const today = new Date();
  const formattedDate = format(today, "EEEE, MMMM d, yyyy");

  return (
    <div className="bg-white">
      {/* Upper section - Today's tasks */}
      <section className="border-b">
        <div className="container px-4 py-8 md:px-6">
          <div className="mb-6 flex flex-col items-start justify-between md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Task Dashboard
              </h1>
              <div className="mt-2 flex items-center text-muted-foreground">
                <CalendarDays className="mr-2 h-4 w-4" />
                <span>{formattedDate}</span>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
                Add New Task
              </button>
            </div>
          </div>

          <h2 className="mb-4 text-xl font-semibold">Today&apos;s Tasks</h2>

          <Suspense fallback={<TaskSkeleton />}>
            <TasksContainer
              filter={{
                due: { before: endOfToday() },
                completed: false,
              }}
              emptyMsg="No tasks due today. Go ahead and relax!"
            />
          </Suspense>
        </div>
      </section>
      {/* Lower section - Upcoming tasks */}
      <section>
        <div className="container px-4 py-8 md:px-6">
          <h2 className="mb-4 text-xl font-semibold">Upcoming Tasks</h2>
          <Suspense fallback={<TaskSkeleton />}>
            <TasksContainer
              filter={{
                due: { after: startOfTomorrow(), before: addMonths(today, 1) },
                completed: false,
              }}
              emptyMsg="No upcoming tasks. You are all caught up!"
            />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
