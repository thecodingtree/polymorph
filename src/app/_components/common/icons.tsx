import {
  ChevronDown,
  ChevronUp,
  Plus,
  Trash,
  Clock,
  CalendarClock,
  NotepadText,
  UserCog,
  type LucideProps,
} from "lucide-react";

export const IconExpand = (props: LucideProps) => <ChevronDown {...props} />;
export const IconCollapse = (props: LucideProps) => <ChevronUp {...props} />;

export const IconAdd = (props: LucideProps) => <Plus {...props} />;
export const IconDelete = (props: LucideProps) => <Trash {...props} />;

export const IconTime = (props: LucideProps) => <Clock {...props} />;

export const IconCalendarClock = (props: LucideProps) => (
  <CalendarClock {...props} />
);

export const IconNote = (props: LucideProps) => <NotepadText {...props} />;

export const IconProfile = (props: LucideProps) => <UserCog {...props} />;
