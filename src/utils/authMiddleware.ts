import type { Context, Next } from "fullsoak";

export const authMiddleware = async (ctx: Context, next: Next) => {
  const userId = await ctx.cookies.get("auth");
  // @NOTE this logic is implemented only for demo purposes, in real
  // PRODUCTION projects we typically use JWT or an equivalent technology
  // to transfer authentication state between server and client
  ctx.app.state.userId = userId;
  await next();
};
