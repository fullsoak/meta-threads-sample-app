import type { Context, Next } from "fullsoak";

export const authMiddleware = async (ctx: Context, next: Next) => {
  const userId = await ctx.cookies.get("auth");
  ctx.app.state.userId = userId;
  await next();
};
