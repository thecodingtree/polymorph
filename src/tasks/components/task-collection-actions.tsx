"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { cn } from "~/lib/utils";

import { PlusCircle, X, Pencil, ChevronLeft } from "lucide-react";

import { api } from "~/trpc/react";

import { Input } from "~/app/_components/ui/input";
import { Button } from "~/app/_components/ui/button";

export default function TaskCollectionActions({
  onEditChange,
}: {
  onEditChange?: (editing: boolean) => void;
}) {
  const [newCollectionName, setNewCollectionName] = useState("");
  const [addingCollection, setAddingCollection] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const collectionCreateMutation = api.taskCollection.create.useMutation();

  const handleNewCollection = () => {
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

  const handleEditChange = (edit: boolean) => {
    setIsEditing(edit);
    onEditChange?.(edit);
  };

  return (
    <div className="flex flex-row justify-items-end gap-2">
      <div className={cn(isEditing && "opacity-25", "flex flex-1 flex-row")}>
        <Input
          type="text"
          placeholder="Name"
          value={newCollectionName}
          onChange={(e) => setNewCollectionName(e.target.value)}
          disabled={isLoading || isEditing}
          className="mr-2"
        />
        <Button
          type="button"
          onClick={handleNewCollection}
          disabled={isLoading || isEditing || !newCollectionName}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          New Collection
        </Button>
      </div>
      <div>
        {isEditing ? (
          <Button type="button" onClick={() => handleEditChange(false)}>
            <X />
            <span>Leave Edit</span>
          </Button>
        ) : (
          <Button type="button" onClick={() => handleEditChange(true)}>
            <Pencil />
            <span>Edit Collections</span>
          </Button>
        )}
      </div>
    </div>
  );
}
