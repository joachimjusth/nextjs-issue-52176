import "server-only";

import { auth } from "@clerk/nextjs";
import { headers } from "next/headers";
import { appRouter } from "~/server/api/root";

export const api = appRouter.createCaller({
  headers: headers(),
  auth: auth(),
});
