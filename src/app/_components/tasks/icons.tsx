import {
  IconBell,
  IconCalendar,
  IconListCheck,
  type IconProps,
} from "@tabler/icons-react";

export const TaskIconReminder = (props: IconProps) => <IconBell {...props} />;

export const TaskIconEvent = (props: IconProps) => <IconCalendar {...props} />;

export const TaskIconTodo = (props: IconProps) => <IconListCheck {...props} />;
