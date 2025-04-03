import {
  type Context,
  Controller,
  ControllerMethodArgs,
  Get,
  Post,
  z,
  type zInfer,
} from "fullsoak";
import { exchangeCodeForShortlivedToken } from "../services/exchangeCodeForShortLivedToken.ts";

import { simpleDb, writeDb } from "../utils/db.ts";
import { getThreadsMentions } from "../services/getThreadsMentions.ts";
import { exchangeShortLivedForLonglivedToken } from "../services/exchangeShortLivedForLongLivedToken.ts";
import { replyThreadsPost } from "../services/replyThreadsPost.ts";

const AuthThreadsReqParam = z.object({
  code: z.string().optional(),
  error_reason: z.enum(["user_denied"]).optional(),
});

const ReplyReqBody = z.object({ replyToId: z.string(), text: z.string() });

@Controller()
export class BackendController {
  @Get("/auth-threads")
  @ControllerMethodArgs("query")
  async authThreads(p: zInfer<typeof AuthThreadsReqParam>, ctx: Context) {
    const { code, error_reason } = AuthThreadsReqParam.parse(p);
    if (!code) {
      return ctx.response.redirect(`/?error=${error_reason || "unknown"}`);
    }
    const shortLivedTokenResp = await exchangeCodeForShortlivedToken(code);
    // console.log({ shortLivedTokenResp });
    const userId = shortLivedTokenResp.user_id;
    const longLivedTokenResp = await exchangeShortLivedForLonglivedToken(
      shortLivedTokenResp.access_token,
    );
    // console.log({ longLivedTokenResp });
    simpleDb[userId] = longLivedTokenResp.access_token;
    await writeDb(simpleDb);
    await ctx.cookies.set("auth", userId, { httpOnly: true });
    ctx.response.redirect("/");
  }

  @Get("/logout")
  async logout(ctx: Context) {
    await ctx.cookies.delete("auth");
    ctx.response.redirect("/");
  }

  @Get("/api/mentions")
  async getMentions(ctx: Context) {
    const { userId } = ctx.app.state;
    if (!userId) return ctx.throw(401);
    const mentions = await getThreadsMentions(
      userId,
      null,
      String(simpleDb[userId]),
    );
    return mentions.data;
  }

  @Post("/api/reply")
  @ControllerMethodArgs("body")
  async reply(body: zInfer<typeof ReplyReqBody>, ctx: Context) {
    const { userId } = ctx.app.state;
    if (!userId) return ctx.throw(401);

    const { replyToId, text } = ReplyReqBody.parse(body);

    return await replyThreadsPost(replyToId, text, String(simpleDb[userId]));
  }
}
