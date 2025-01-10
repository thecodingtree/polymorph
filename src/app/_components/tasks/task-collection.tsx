import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "~/app/_components/ui/button";
import { Input } from "~/app/_components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "~/app/_components/ui/card";

import type { TaskCollection, TaskUpdate, TaskCreate } from "~/types";
import { TaskType } from "~/types";
import TaskItem from "./task-item";

type TaskCollectionProps = {
  collection: TaskCollection;
  addTask: (collectionId: string, task: TaskCreate) => void;
  updateTask: (collectionId: string, taskId: string, data: TaskUpdate) => void;
};

export default function TaskCollection({
  collection,
  addTask,
  updateTask,
}: TaskCollectionProps) {
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask(collection.id, {
        type: TaskType.TODO,
        title: newTaskTitle.trim(),
      });
      setNewTaskTitle("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{collection.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center">
          <Input
            type="text"
            placeholder="New Task"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="mr-2"
          />
          <Button onClick={handleAddTask} size="sm">
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2">
          {collection?.tasks?.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              updateTask={(id, updates) =>
                updateTask(collection.id, id, updates)
              }
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
