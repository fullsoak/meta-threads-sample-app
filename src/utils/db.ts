/**
 * this file is an effort to "keep it stupid simple" (KISS)
 * because this codebase only focuses on using the web framework
 * and _not_ on production practices. Please do NOT use this
 * on real projects!!!
 */

import { join } from "path";
import { DatabaseSync } from "node:sqlite";

const dbPath = join(import.meta.dirname || "", "../../db/sqlite.db");
const db = new DatabaseSync(dbPath);

export type UserEntity = {
  userId: string;
  accessToken: string;
};

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    userId TEXT PRIMARY KEY,
    accessToken TEXT
  )
`);

const getUserEntry = (userId: string): UserEntity => {
  return db.prepare("SELECT userId, accessToken FROM users WHERE userId = ?").get(
    userId,
  ) as UserEntity;
};

const insertOrReplaceUserEntry = (userId: string, accessToken: string) => {
  db.prepare(
    "INSERT OR REPLACE INTO users (userId, accessToken) VALUES (?, ?)",
  ).run(userId, accessToken);
};

const isLoggedIn = (userId?: string): boolean => {
  if (!userId) {
    return false;
  }
  try {
    const user = getUserEntry(userId);
    return user != null;
  } catch (error) {
    console.error("Error checking login status:", error);
    return false;
  }
};

export { db, getUserEntry, insertOrReplaceUserEntry, isLoggedIn };
