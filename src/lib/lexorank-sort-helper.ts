import { LexoRank } from "lexorank";
import type { DragEndEvent } from "@dnd-kit/core/dist/types";
import type { UniqueIdentifier } from "@dnd-kit/core";

/**
 * The code in this file was extracted from the dnd-kit example found here:
 * https://github.com/kvandake/lexorank-ts/tree/master/stories/dnd-kit
 *
 */

export interface IId {
  id: UniqueIdentifier;
}

export interface IHasRank {
  rank: string;
}

export interface IListItemData extends IId, IHasRank {
  name: string;
}

export interface ISortablePayload<TEntity extends IId> {
  prevEntity?: TEntity;
  entity: TEntity;
  nextEntity?: TEntity;
}

export function sortByLexoRankAsc(a: IHasRank, b: IHasRank): number {
  if (!a.rank && b.rank) {
    return -1;
  }
  if (a.rank && !b.rank) {
    return 1;
  }

  if (!a.rank || !b.rank) {
    return 0;
  }

  return a.rank.localeCompare(b.rank);
}

export function createSortablePayloadByIndex<TEntity extends IId & IHasRank>(
  items: TEntity[],
  event: DragEndEvent,
): ISortablePayload<TEntity> {
  const { active, over } = event;
  const oldIndex = items.findIndex((x) => x.id === active.id);
  const newIndex = items.findIndex((x) => x.id === over?.id);
  let input: ISortablePayload<TEntity>;
  const entity = items[oldIndex];

  // If the item is dragged to the top
  if (newIndex === 0) {
    const nextEntity = items[newIndex];
    input = {
      prevEntity: undefined,
      entity: entity,
      nextEntity: nextEntity,
    } as ISortablePayload<TEntity>;

    // If the item is dragged to the bottom
  } else if (newIndex === items.length - 1) {
    const prevEntity = items[newIndex];
    input = {
      prevEntity: prevEntity,
      entity: entity,
      nextEntity: undefined,
    } as ISortablePayload<TEntity>;

    // If the item is dragged in between
  } else {
    const prevEntity = items[newIndex];
    const offset = oldIndex > newIndex ? -1 : 1;
    const nextEntity = items[newIndex + offset];
    input = {
      prevEntity: prevEntity,
      entity: entity,
      nextEntity: nextEntity,
    } as ISortablePayload<TEntity>;
  }

  return input;
}

export function getBetweenRankAsc<TEntity extends IId & IHasRank>(
  payload: ISortablePayload<TEntity>,
): LexoRank {
  const { prevEntity, entity, nextEntity } = payload;
  let newLexoRank: LexoRank;
  if (!prevEntity && !!nextEntity) {
    newLexoRank = LexoRank.parse(nextEntity.rank).genPrev();
  } else if (!nextEntity && !!prevEntity) {
    newLexoRank = LexoRank.parse(prevEntity.rank).genNext();
  } else if (!!prevEntity && !!nextEntity) {
    newLexoRank = LexoRank.parse(nextEntity.rank).between(
      LexoRank.parse(prevEntity.rank),
    );
  } else {
    newLexoRank = LexoRank.parse(entity.rank).genNext();
  }

  return newLexoRank;
}
