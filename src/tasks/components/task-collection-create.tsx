"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { PlusCircle } from "lucide-react";

import { api } from "~/trpc/react";

import { Input } from "~/app/_components/ui/input";
import { Button } from "~/app/_components/ui/button";

export default function TaskCollectionCreate() {
  const [newCollectionName, setNewCollectionName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const collectionCreateMutation = api.taskCollection.create.useMutation();

  const handleCollectionCreate = () => {
    setIsLoading(true);
    collectionCreateMutation.mutate(
      {
        name: newCollectionName,
      },
      {
        onSuccess: () => {
          // TODO: This is not best way to get the new collection, but it's fine for now
          router.refresh();
        },
        onError: (err) => {
          console.log("Error creating collection", err);
          toast.error("Error creating collection");
        },

        onSettled: () => {
          setIsLoading(false);
          setNewCollectionName("");
        },
      },
    );
  };

  return (
    <div className="mb-6 flex items-center">
      <Input
        type="text"
        placeholder="New Collection Name"
        value={newCollectionName}
        onChange={(e) => setNewCollectionName(e.target.value)}
        disabled={isLoading}
        className="mr-2"
      />
      <Button
        type="button"
        onClick={handleCollectionCreate}
        disabled={isLoading}
      >
        <PlusCircle className="mr-2 h-4 w-4" /> Add Collection
      </Button>
    </div>
  );
}
