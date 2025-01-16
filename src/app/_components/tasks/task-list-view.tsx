import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "~/app/_components/ui/button";
import { Input } from "~/app/_components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/app/_components/ui/accordion";
import TaskItem from "./task-item";

import type { TaskCollection, TaskCreate } from "~/types";
import { TaskType } from "~/types";

export default function TaskListView({
  collections,
  addTask,
}: {
  collections: TaskCollection[];
  addTask: (collectionId: string, task: TaskCreate) => void;
}) {
  const [newTaskTitles, setNewTaskTitles] = useState<Record<string, string>>(
    {},
  );

  const handleAddTask = (collectionId: string) => {
    const newTaskTitle = newTaskTitles[collectionId] ?? "";
    if (newTaskTitle.trim()) {
      addTask(collectionId, {
        type: TaskType.TODO,
        title: newTaskTitle.trim(),
      });
      setNewTaskTitles({ ...newTaskTitles, [collectionId]: "" });
    }
  };

  return (
    <Accordion type="multiple" className="w-full">
      {collections.map((collection) => (
        <AccordionItem key={collection.id} value={collection.id}>
          <AccordionTrigger className="text-lg font-semibold">
            {collection.name}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {collection?.tasks?.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
              <div className="mt-2 flex items-center">
                <Input
                  type="text"
                  placeholder="New Task"
                  value={newTaskTitles[collection.id] ?? ""}
                  onChange={(e) =>
                    setNewTaskTitles({
                      ...newTaskTitles,
                      [collection.id]: e.target.value,
                    })
                  }
                  className="mr-2"
                />
                <Button onClick={() => handleAddTask(collection.id)} size="sm">
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
