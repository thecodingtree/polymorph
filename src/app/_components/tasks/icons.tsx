import {
  IconPhone,
  IconCalendar,
  IconListCheck,
  IconMail,
  IconUserCheck,
  IconNotes,
  type IconProps,
} from "@tabler/icons-react";

export const TaskIconCall = (props: IconProps) => <IconPhone {...props} />;

export const TaskIconEvent = (props: IconProps) => <IconCalendar {...props} />;

export const TaskIconTodo = (props: IconProps) => <IconListCheck {...props} />;

export const TaskIconEmail = (props: IconProps) => <IconMail {...props} />;

export const TaskIconFolllowUp = (props: IconProps) => (
  <IconUserCheck {...props} />
);

export const TaskIconOther = (props: IconProps) => <IconNotes {...props} />;
