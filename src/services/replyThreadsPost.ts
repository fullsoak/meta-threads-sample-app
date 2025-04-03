import { sleep } from "../utils/sleep.ts";

const publishMediaContainer = async (containerId: string, token: string) => {
  const url =
    `https://graph.threads.net/v1.0/me/threads_publish?creation_id=${containerId}`;
  const resp = await fetch(url, {
    method: "post",
    headers: {
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
  });
  const res = await resp.json();
  console.log("publishMediaContainer res", res);
  return res;
};

export const replyThreadsPost = async (
  replyToId: string,
  text: string | null,
  token: string,
) => {
  const url =
    `https://graph.threads.net/v1.0/me/threads?reply_to_id=${replyToId}`;
  const resp = await fetch(url, {
    method: "post",
    headers: {
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ text, media_type: "TEXT" }),
  });
  const mediaContainerRes = (await resp.json()) || {};
  console.log("reply_to_id result", mediaContainerRes);
  if (mediaContainerRes.error) return mediaContainerRes;
  await sleep(300);
  const { id } = mediaContainerRes;
  if (id) return publishMediaContainer(id, token);
};
