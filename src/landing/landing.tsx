"use client";
import React, { useState } from "react";

import Calendar from "~/calendar/calendar";
import { TaskDetailsDialog } from "~/tasks/components/task-details";

import { useTaskApi } from "~/tasks/hooks/useTaskApi";

import type { Task } from "~/tasks/types";
import type { Maybe } from "~/types";

export default function Landing() {
  const [selectedTask, setSelectedTask] = useState<Maybe<Task>>(null);

  const { tasks, updateTask, deleteTask } = useTaskApi({});

  return (
    <div className="bg-white">
      <Calendar tasks={tasks as Maybe<Task>[]} onSelectTask={setSelectedTask} />
      {selectedTask && (
        <TaskDetailsDialog
          defaultOpen={true}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedTask(null);
            }
          }}
          task={selectedTask}
          taskMutator={updateTask}
          taskDeletor={deleteTask}
        />
      )}
    </div>
  );
}
