"use client";

import React from "react";

import { api } from "~/trpc/react";
import TasksList from "./TasksList";

export default function TaskCollections() {
  const { data } = api.taskCollection.list.useQuery({});

  return (
    <div>
      <h1>Task Collections</h1>
      <ul className="flex flex-col gap-4">
        {data?.map((taskCollection) => (
          <li key={taskCollection.id}>
            <div className="text-lg font-bold">{taskCollection.name}</div>
            <div>
              <TasksList tasks={taskCollection?.tasks} selectedTasks={[]} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
