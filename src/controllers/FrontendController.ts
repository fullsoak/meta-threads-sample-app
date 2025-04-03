import { Context, Controller, Get, ssr } from "fullsoak";
import { makeHat } from "fullsoak/batteries";
import { Home } from "../components/Home/index.tsx";
import { isLoggedIn } from "../utils/db.ts";
import { getThreadProfile } from "../services/getThreadsProfile.ts";

const defaultThreadsAppScope =
  "threads_basic,threads_manage_mentions,threads_content_publish";

const getThreadsLoginUrl = (): string => {
  const redirectUri = encodeURIComponent(
    Deno.env.get("THREADS_AUTH_CODE_REDIRECT_URI") || "",
  );
  return "https://threads.net/oauth/authorize" +
    `?client_id=${Deno.env.get("THREADS_APP_ID")}` +
    `&redirect_uri=${redirectUri}` +
    `&scope=${
      Deno.env.get("THREADS_APP_AUTH_SCOPE") || defaultThreadsAppScope
    }` +
    "&response_type=code";
};

const headContent = makeHat({
  title: "Meta Threads Sample App :: FullSoak",
  links: [{
    rel: "stylesheet",
    href:
      "https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.20.1/cdn/themes/light.css",
  }, {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=DM%20Mono",
  }],
  scripts: [{
    type: "module",
    src:
      "https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.20.1/cdn/shoelace-autoloader.js",
  }],
});

@Controller()
export class FrontendController {
  @Get("/")
  async home(ctx: Context) {
    const userId = await ctx.cookies.get("auth");
    const loggedIn = isLoggedIn(userId);
    return ssr(Home, {
      loggedIn,
      threadsLoginUrl: getThreadsLoginUrl(),
      threadsProfile: loggedIn ? await getThreadProfile(userId) : undefined,
    }, { headContent });
  }
}
