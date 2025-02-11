import { coreEntityRouter } from "~/server/api/routers/coreEntity";
import { coreEntityBlueprintRouter } from "~/server/api/routers/coreEntityBlueprint";
import { taskRouter } from "~/server/api/routers/task";
import { taskCollectionRouter } from "~/server/api/routers/taskCollection";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  coreEntity: coreEntityRouter,
  coreEntityBlueprint: coreEntityBlueprintRouter,
  task: taskRouter,
  taskCollection: taskCollectionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
