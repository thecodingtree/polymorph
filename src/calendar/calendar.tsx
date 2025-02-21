"use client";
import { useState } from "react";
import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
  Views,
  type View,
} from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";

import type { Task } from "~/tasks/types";
import type { Maybe } from "~/types";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function Calendar({
  tasks,
  onSelectTask,
}: {
  tasks: Maybe<Task>[];
  onSelectTask?: (task: Maybe<Task>) => void;
}) {
  const [view, setView] = useState<View>(Views.WEEK);
  const [date, setDate] = useState(new Date());

  const events =
    tasks?.map((task) => {
      const allDay = !task?.startDate;

      return {
        id: task?.id,
        title: task?.title,
        start: task?.startDate ?? task?.endDate,
        end: task?.endDate,
        allDay,
      };
    }) ?? [];

  return (
    <div className="h-[800px] rounded-sm border-2 border-gray-200">
      <BigCalendar
        localizer={localizer}
        events={events}
        views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
        defaultView={view}
        view={view}
        date={date}
        onView={(view) => setView(view)}
        onNavigate={(newDate) => setDate(newDate)}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={(event) =>
          onSelectTask?.(tasks?.find((task) => task?.id === event.id))
        }
        style={{ height: "100%" }}
      />
    </div>
  );
}
