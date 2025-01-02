import { type TaskFilter } from "~/types";

import FilterSelect from "~/app/_components/controls/FilterSelect";

import { TaskType } from "~/types";

import { getTaskIcon } from "~/app/_components/tasks/utils";

const filterItems = Object.values(TaskType).map((type) => ({
  key: type,
  icon: getTaskIcon(type),
}));

export default function TaskFilters({
  filters,
  onFilterChange,
}: {
  filters?: TaskFilter;
  onFilterChange: (filter?: TaskFilter) => void;
}) {
  const handleFilterChange = (filter: TaskFilter) => {
    onFilterChange(filter);
  };

  return (
    <div className="flex flex-row gap-10">
      <div className="grid-3 grid grid-flow-col gap-2">
        <FilterSelect
          selected={filters?.type}
          onChange={(typeFilter) => {
            handleFilterChange({
              ...filters,
              type: typeFilter as TaskType[],
            });
          }}
          allowMultiple
          allowNone
          items={filterItems}
        />
      </div>
    </div>
  );
}
