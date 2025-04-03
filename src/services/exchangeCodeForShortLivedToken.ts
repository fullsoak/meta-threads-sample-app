type AccessTokenSuccessResponse = {
  access_token: string;
  user_id: string;
};

export const exchangeCodeForShortlivedToken = async (
  code: string,
): Promise<AccessTokenSuccessResponse> => {
  const url = "https://graph.threads.net/oauth/access_token" +
    `?client_id=${Deno.env.get("THREADS_APP_ID")}` +
    `&client_secret=${Deno.env.get("THREADS_APP_SECRET")}` +
    `&code=${code}` +
    `&grant_type=authorization_code` +
    `&redirect_uri=${Deno.env.get("THREADS_AUTH_CODE_REDIRECT_URI")}`;

  const resp = await fetch(url, { method: "post" });
  // console.log("resp for", url, resp);
  return await resp.json();
};
