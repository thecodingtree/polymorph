import React from "react";

import { api } from "~/trpc/server";

import { Input } from "~/app/_components/ui/input";
import { Button } from "~/app/_components/ui/button";

export default function CoreEntityForm() {
  return (
    <form
      action={async () => {
        "use server";

        await api.coreEntity.create({
          blueprintId: "",
          values: [],
        });
      }}
      className="space-y-8"
    >
      <Input name="blueprintId" placeholder="blueprintId" />
      <Button type="submit">Submit</Button>
    </form>
  );
}
