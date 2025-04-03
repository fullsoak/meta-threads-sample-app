type MetaMediaResponse<T> = {
  data: T[];
};

type SimpleMetaObject = {
  id: string;
};

export type Mention = SimpleMetaObject & {
  username: string;
  text: string;
  root_post: SimpleMetaObject;
  replied_to: SimpleMetaObject;
  permalink: string;
  shortcode: string;
  timestamp: string;
};

export const getThreadsMentions = async (
  userId: string,
  fields: string | null,
  token: string,
): Promise<MetaMediaResponse<Mention>> => {
  console.log(
    `requesting at '/mentions/me' instead of /mentions/${userId} due to potential Threads bug`,
  );
  const theFields = fields ||
    "id,username,text,media_url,root_post,replied_to,permalink,shortcode,timestamp";
  const url = `https://graph.threads.net/me/mentions?fields=${theFields}`;
  const resp = await fetch(url, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  return resp.json();
};
