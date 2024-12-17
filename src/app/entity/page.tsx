import { api, HydrateClient } from "~/trpc/server";

import { Card } from "~/app/_components/ui/card";

import CoreEntityForm from "../_components/forms/CoreEntityForm";

export default async function Entity() {
  const entities = await api.coreEntity.list();

  const entityTypes = await api.coreEntityType.list();

  console.log({ entities, entityTypes });

  return (
    <div className="flex flex-row justify-center">
      <HydrateClient>
        <div className="flex-1 flex-col">
          <h2 className="text-xl">Entities</h2>
          <ul>
            {entities.map((entity) => (
              <li className="border-1" key={entity.id}>
                <Card className="p-1">
                  <div>{entity?.id}</div>
                </Card>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-1 flex-col">
          <CoreEntityForm />
          {entityTypes.map((entityType) => (
            <Card key={entityType.id} className="p-1">
              <div>{entityType.id}</div>
              <div>{entityType.name}</div>
              <div>{entityType.description}</div>
            </Card>
          ))}
        </div>
      </HydrateClient>
    </div>
  );
}
