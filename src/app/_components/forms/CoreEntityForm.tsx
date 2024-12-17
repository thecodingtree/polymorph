import React from "react";

import { api } from "~/trpc/server";

import { Input } from "~/app/_components/ui/input";
import { Button } from "~/app/_components/ui/button";

export default function CoreEntityForm() {
  return (
    <form
      action={async (data) => {
        "use server";

        const typeId: string = data.get("typeId")?.toString() ?? "";
        await api.coreEntity.create({
          typeId,
        });
      }}
      className="space-y-8"
    >
      <Input name="typeId" placeholder="typeId" />
      <Button type="submit">Submit</Button>
    </form>
  );
}
