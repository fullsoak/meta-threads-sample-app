type AccessTokenSuccessResponse = {
  access_token: string;
  user_id: string;
};

export const exchangeShortLivedForLonglivedToken = async (
  shortLivedToken: string,
): Promise<AccessTokenSuccessResponse> => {
  const url = "https://graph.threads.net/access_token" +
    `?client_secret=${Deno.env.get("THREADS_APP_SECRET")}` +
    `&grant_type=th_exchange_token` +
    `&access_token=${shortLivedToken}`;

  const resp = await fetch(url);
  // console.log("resp for", url, resp);
  return await resp.json();
};
