import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import mysql from "mysql2/promise";
import { config } from "../config/env.js";

const here = dirname(fileURLToPath(import.meta.url));
const schemaPath = resolve(here, "../../db/schema.sql");

async function migrate() {
  const schema = await readFile(schemaPath, "utf8");

  const connection = await mysql.createConnection({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    multipleStatements: true
  });

  try {
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${config.db.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    await connection.query(`USE \`${config.db.database}\``);
    await connection.query(schema);
    console.log(`Migrated schema into database "${config.db.database}"`);
  } finally {
    await connection.end();
  }
}

migrate().catch((error) => {
  console.error("Migration failed", error);
  process.exit(1);
});
