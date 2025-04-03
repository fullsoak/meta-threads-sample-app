/**
 * this file is an effort to "keep it stupid simple" (KISS)
 * because this codebase only focuses on using the web framework
 * and _not_ on production practices. Please do NOT use this
 * on real projects!!!
 */

import { join } from "path";

type SimpleDB = Record<string, unknown>;

let simpleDb: SimpleDB = {};

const simpleDbJsonPath = join(
  import.meta.dirname || "",
  "../../db/simple.json",
);

const initSimpleDb = async (): Promise<SimpleDB> => {
  try {
    await Deno.lstat(simpleDbJsonPath);
    simpleDb = JSON.parse(await Deno.readTextFile(simpleDbJsonPath));
  } catch (err) {
    if (!(err instanceof Deno.errors.NotFound)) {
      throw err;
    }
    await writeDb(simpleDb);
  }
  return simpleDb;
};

const writeDb = async (wholeDb: SimpleDB): Promise<void> => {
  await Deno.writeTextFile(simpleDbJsonPath, JSON.stringify(wholeDb));
};

await initSimpleDb();

const isLoggedIn = (userId?: string): boolean => {
  return simpleDb[userId!] != null;
};

export { isLoggedIn, simpleDb, writeDb };
