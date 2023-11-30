import { z } from "zod";

import { createTRPCRouter, proctectedProcedure } from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  hello: proctectedProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
});
