/**
 * this file is an effort to "keep it stupid simple" (KISS)
 * when it comes to loading .env data; please feel free to
 * use your own preferred method of handling .env file, in
 * whichever way you want :)
 */

import { join } from "path";

const dotEnv: Record<string, string> = {};

const DOT_ENV_PATH = join(import.meta.dirname || "", "../../.env");

export const loadDotEnv = async () => {
  let rawEnv = "";
  try {
    rawEnv = await Deno.readTextFile(DOT_ENV_PATH);
  } catch (e) {
    console.error("failed to load .env", (e as Error).stack);
  }
  rawEnv.split("\n").forEach((line) => {
    const [pairStr] = line.split("#");
    const [key, val] = pairStr.split("=");
    dotEnv[key] = val;
    Deno.env.set(key, val);
  });
};

export const appendToDotEnv = async (key: string, val: string) => {
  dotEnv[key] = val;
  let dotEnvStr = "";
  for (const k in dotEnv) {
    dotEnvStr += `${k}=${dotEnv[k]}\n`;
  }
  await Deno.writeTextFile(DOT_ENV_PATH, dotEnvStr);
};
