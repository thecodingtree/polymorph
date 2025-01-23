"use server";

import { Suspense } from "react";
import { PlusCircle } from "lucide-react";

import { api } from "~/trpc/server";

import { Button } from "~/app/_components/ui/button";
import { Input } from "~/app/_components/ui/input";
import TaskCollection from "./task-collection";

export default async function TaskList() {
  const collections = await api.taskCollection.list({});

  const addCollection = () => {
    // if (newCollectionName.trim()) {
    //   setCollections([
    //     ...collections,
    //     {
    //       id: Date.now().toString(),
    //       name: newCollectionName.trim(),
    //       tasks: [],
    //     },
    //   ]);
    //   setNewCollectionName("");
    // }
  };

  return (
    <div className="mx-2 min-w-96">
      <div className="mb-6 flex items-center">
        <Input
          type="text"
          placeholder="New Collection Name"
          //value={newCollectionName}
          //onChange={(e) => setNewCollectionName(e.target.value)}
          className="mr-2"
        />
        {/* <Button onClick={addCollection}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Collection
        </Button> */}
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Suspense fallback={<div>Loading...</div>}>
          {collections?.map((collection) => (
            <TaskCollection key={collection.id} collection={collection} />
          ))}
        </Suspense>
      </div>
    </div>
  );
}
