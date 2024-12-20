import { api, HydrateClient } from "~/trpc/server";

import { Card } from "~/app/_components/ui/card";

import CoreEntityForm from "../_components/forms/CoreEntityForm";
import EntityItem from "../_components/entity/EntityItem";
import EntityCreate from "../_components/entity/EntityCreate";

export default async function Entity() {
  const entities = await api.coreEntity.list({});

  const entityBlueprints = await api.coreEntityBlueprint.list({});

  console.log({ entities, entityBlueprints });

  return (
    <div className="flex flex-row justify-center">
      <HydrateClient>
        <div className="flex-1 flex-col">
          <h2 className="text-xl">Entities</h2>
          <ul>
            {entities.map((entity) => (
              <li className="border-1" key={entity.id}>
                <EntityItem entity={entity} />
              </li>
            ))}
          </ul>
          <EntityCreate blueprints={entityBlueprints} />
        </div>

        <div className="flex-1 flex-col">
          <CoreEntityForm />
          {entityBlueprints.map((blueprint) => (
            <Card key={blueprint.id} className="p-1">
              <div>{blueprint.id}</div>
              <div>{blueprint.name}</div>
              <div>{blueprint.description}</div>
              <ul className="ml-4 list-disc space-y-1">
                {/* {blueprint?.parent?.attributes?.map((ceAttr) => (
                  <li key={ceAttr.id} className="text-gray-500">
                    <div className="flex flex-col">
                      <div>{ceAttr.id}</div>
                      <div>{ceAttr.attribute?.name}</div>{" "}
                      <div>{ceAttr.attribute?.valueType}</div>
                      <div>{ceAttr.required ? "required" : "optional"}</div>
                    </div>
                  </li>
                ))} */}
                {blueprint?.attributes?.map((ceAttr) => (
                  <li key={ceAttr.attribute?.id} className="text-black">
                    <div className="flex flex-col">
                      <div>{ceAttr.attribute?.id}</div>
                      <div>{ceAttr.attribute?.name}</div>{" "}
                      <div>{ceAttr.attribute?.valueType}</div>
                      <div>{ceAttr.required ? "required" : "optional"}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </HydrateClient>
    </div>
  );
}
