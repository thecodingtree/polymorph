"use client";
import React from "react";

import { format, addMonths, endOfToday, startOfTomorrow } from "date-fns";
import { CalendarDays } from "lucide-react";

import { useTaskApi } from "~/tasks/hooks/useTaskApi";

import Task from "~/landing/task";
import TaskSkeleton from "~/landing/task-skeleton";

export default function Landing() {
  // Get today's date
  const today = new Date();
  const formattedDate = format(today, "EEEE, MMMM d, yyyy");

  const {
    tasks: todaysTasks,
    updateTask,
    isLoading: isTodayLoading,
  } = useTaskApi({
    due: { before: endOfToday() },
    completed: false,
  });

  const { tasks: upcomingTasks, isLoading: isUpcomingLoading } = useTaskApi({
    due: { after: startOfTomorrow(), before: addMonths(today, 1) },
    completed: false,
  });

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

          {!isTodayLoading ? (
            <div className="grid gap-4">
              {todaysTasks?.length === 0 ? (
                <p className="text-muted-foreground">
                  No tasks for today. Enjoy your day!
                </p>
              ) : (
                todaysTasks?.map((task) => (
                  <Task
                    key={task.id}
                    task={task}
                    onCompleteTask={(id) =>
                      updateTask.mutate({
                        ids: [id],
                        data: { completed: true },
                      })
                    }
                  />
                ))
              )}
            </div>
          ) : (
            <div className="grid gap-4">
              <TasksLoading num={2} />
            </div>
          )}
        </div>
      </section>
      {/* Lower section - Upcoming tasks */}
      <section>
        <div className="container px-4 py-8 md:px-6">
          <h2 className="mb-4 text-xl font-semibold">Upcoming Tasks</h2>

          {!isUpcomingLoading ? (
            <div className="grid gap-4">
              {upcomingTasks?.length === 0 ? (
                <p className="text-muted-foreground">
                  No upcoming tasks scheduled.
                </p>
              ) : (
                upcomingTasks?.map((task) => (
                  <Task
                    key={task.id}
                    task={task}
                    onCompleteTask={(id) =>
                      updateTask.mutate({
                        ids: [id],
                        data: { completed: true },
                      })
                    }
                  />
                ))
              )}
            </div>
          ) : (
            <div className="grid gap-4">
              <TasksLoading num={3} />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function TasksLoading({ num }: { num: number }) {
  const tasks = Array.from({ length: num }, (_, i) => <TaskSkeleton key={i} />);

  return <>{tasks}</>;
}
