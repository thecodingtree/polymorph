"use client";

import { useState } from "react";

import { PlusCircle, X, Pencil } from "lucide-react";

import { Input } from "~/app/_components/ui/input";
import { Button } from "~/app/_components/ui/button";

export default function TaskCollectionActions({
  isEditing,
  onAddCollection,
  onEditChange,
}: {
  isEditing: boolean;
  onAddCollection?: (collectionName: string) => void;
  onEditChange?: (editing: boolean) => void;
}) {
  const [newCollectionName, setNewCollectionName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleNewCollection = () => {
    setIsLoading(true);
    onAddCollection?.(newCollectionName);
    setNewCollectionName("");
    setIsLoading(false);
  };

  const handleEditChange = (edit: boolean) => {
    onEditChange?.(edit);
  };

  return (
    <div className="flex flex-row justify-items-end gap-2">
      {isEditing && (
        <div className="flex flex-1 flex-row">
          <Input
            type="text"
            placeholder="Name"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            disabled={isLoading}
            className="mr-2"
          />
          <Button
            type="button"
            onClick={handleNewCollection}
            disabled={isLoading || !newCollectionName}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Collection
          </Button>
        </div>
      )}
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
