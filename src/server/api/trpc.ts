import "server-only";

import { initTRPC, TRPCError } from "@trpc/server";
import { type NextRequest } from "next/server";
import superjson from "superjson";
import { ZodError } from "zod";

import {
  getAuth,
  type SignedInAuthObject,
  type SignedOutAuthObject,
} from "@clerk/nextjs/server";

interface CreateContextOptions {
  headers: Headers;
  auth: SignedInAuthObject | SignedOutAuthObject;
}

export const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    auth: opts.auth,
    headers: opts.headers,
  };
};

export const createTRPCContext = (opts: { req: NextRequest }) => {
  return createInnerTRPCContext({
    headers: opts.req.headers,
    auth: getAuth(opts.req),
  });
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ error, shape }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.auth.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      auth: ctx.auth,
      headers: ctx.headers,
    },
  });
});

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;
export const proctectedProcedure = t.procedure.use(isAuthed);
