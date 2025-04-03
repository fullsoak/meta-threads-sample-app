/**
 * Example using this file: `deno run src/utils/migrate.ts`
 * @NOTE only use it if we have data in a json file that we
 * want to "import" into an sqlite db file; if you don't have
 * such a need, then you may simply ignore this file
 */

import { join } from "path";
import { db } from "../utils/db.ts";

const simpleDbJsonPath = join(
  import.meta.dirname || "",
  "../../db/simple.json",
);

try {
  const simpleDb = JSON.parse(await Deno.readTextFile(simpleDbJsonPath));

  for (const userId in simpleDb) {
    const accessToken = simpleDb[userId];
    db.exec(
      `INSERT OR REPLACE INTO users (userId, accessToken) VALUES ("${userId}", "${accessToken}")`,
    );
  }

  console.log("Data migration complete!");
} catch (error) {
  console.error("Data migration failed:", error);
}
