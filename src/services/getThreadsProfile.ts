import { getUserEntry } from "../utils/db.ts";

export type ThreadsProfile = {
  id: string;
  username: string;
  threads_profile_picture_url: string;
  threads_biography: string;
};

export const getThreadProfile = async (
  userId?: string,
): Promise<ThreadsProfile | undefined> => {
  if (!userId) return;
  const user = getUserEntry(userId);
  const token = user ? user.accessToken : null;
  if (!token) return;
  const resp = await fetch(
    "https://graph.threads.net/me?fields=id,username,name,threads_profile_picture_url,threads_biography",
    {
      headers: { "Authorization": `Bearer ${token}` },
    },
  );
  return await resp.json();
};
