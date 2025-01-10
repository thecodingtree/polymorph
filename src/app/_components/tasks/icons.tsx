import { Bell, Calendar1, ListTodo, type LucideProps } from "lucide-react";

export const TaskIconReminder = (props: LucideProps) => <Bell {...props} />;

export const TaskIconEvent = (props: LucideProps) => <Calendar1 {...props} />;

export const TaskIconTodo = (props: LucideProps) => <ListTodo {...props} />;
