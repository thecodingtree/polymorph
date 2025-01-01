import {
  IconAddressBook,
  IconTopologyStar3,
  IconBuilding,
  IconUsers,
  IconLayoutDashboard,
  IconChevronDown,
  IconChevronUp,
  IconPlus,
  IconClock,
  IconCalendarClock as IconCalendarClockTabler,
  IconNote as IconNoteTabler,
  IconUserEdit,
  type IconProps,
} from "@tabler/icons-react";

export const IconDashboard = (props: IconProps) => (
  <IconLayoutDashboard {...props} />
);

export const IconContact = (props: IconProps) => <IconAddressBook {...props} />;

export const IconCompany = (props: IconProps) => (
  <IconTopologyStar3 {...props} />
);

export const IconProperty = (props: IconProps) => <IconBuilding {...props} />;

export const IconTeam = (props: IconProps) => <IconUsers {...props} />;

export const IconExpand = (props: IconProps) => <IconChevronDown {...props} />;
export const IconCollapse = (props: IconProps) => <IconChevronUp {...props} />;

export const IconAdd = (props: IconProps) => <IconPlus {...props} />;

export const IconTime = (props: IconProps) => <IconClock {...props} />;

export const IconCalendarClock = (props: IconProps) => (
  <IconCalendarClockTabler {...props} />
);

export const IconNote = (props: IconProps) => <IconNoteTabler {...props} />;

export const IconProfile = (props: IconProps) => <IconUserEdit {...props} />;
