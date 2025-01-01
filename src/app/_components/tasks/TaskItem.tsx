"use client";

import { useState } from "react";

import { IconCalendar } from "@tabler/icons-react";

import { Checkbox } from "~/app/_components/ui/checkbox";
import { CardContent, CardHeader, Card } from "~/app/_components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/app/_components/ui/collapsible";

import {
  IconExpand,
  IconCollapse,
  IconTime,
} from "~/app/_components/common/icons";

import { type Task } from "~/types";

import { getTaskIcon, getTaskDateLabel, getPrioirtyBadge } from "./utils";

export default function TaskItem({
  task,
  selected,
  onSelectChange,
}: {
  task: Task;
  selected?: boolean;
  onSelectChange?: (selected: boolean) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Collapsible defaultOpen={false} onOpenChange={setIsExpanded}>
      <Card>
        <CollapsibleTrigger className="w-full" asChild>
          <CardHeader className="cursor-pointer p-0 text-sm font-medium">
            <div className="flex items-center justify-between rounded-tl-lg rounded-tr-lg bg-gray-100 px-4 py-2 dark:bg-gray-800/40">
              <div>
                <div className="flex items-center gap-2">
                  <div className="mr-2 flex">
                    <Checkbox
                      checked={selected}
                      onClick={(e) => {
                        e.preventDefault();
                        onSelectChange?.(!selected);
                      }}
                    />
                  </div>
                  {getTaskIcon(task.type)}
                  <span className="">{task.description}</span>
                  <div className="font-light">
                    {/* {task?.assignee?.name
                      ? `Assigned By: ${task?.assignee?.name}`
                      : null} */}
                  </div>
                </div>
              </div>

              <div className="flex flex-row items-center gap-4">
                <div>{getTaskDateLabel(task?.endDate, task.startDate)}</div>
                {isExpanded ? (
                  <IconCollapse className="h-4 w-4" />
                ) : (
                  <IconExpand className="h-4 w-4" />
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="p-4">
            <div className="grid gap-4 font-medium text-gray-500">
              <div className="">{task.content}</div>
              <div className="grid gap-2 text-xs dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <IconTime className="h-4 w-4" />
                  <span className="">
                    {task?.endDate?.toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <IconCalendar className="h-4 w-4" />
                  <span className="">
                    {task?.endDate?.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {getPrioirtyBadge(task.priority)}
                </div>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
