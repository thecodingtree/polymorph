"use client";

import React, { useState } from "react";

import { type CoreEntityBlueprint } from "~/types";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/app/_components/ui/select";

import EntityForm from "~/app/_components/entity/EntityForm";

export default function EntityCreate({
  blueprints,
}: {
  blueprints: CoreEntityBlueprint[];
}) {
  const [selectedBlueprint, setSelectedBlueprint] = useState(blueprints[0]);

  return (
    <div>
      <Select
        defaultValue={selectedBlueprint?.id}
        onValueChange={(value) =>
          setSelectedBlueprint(
            blueprints.find((blueprint) => blueprint.id === value),
          )
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a Blueprint" />
        </SelectTrigger>
        <SelectContent>
          {blueprints.map((blueprint) => (
            <SelectItem key={blueprint.id} value={blueprint.id}>
              {blueprint.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedBlueprint && <EntityForm blueprint={selectedBlueprint} />}
    </div>
  );
}
