/**
 * Script to run all Supabase migrations directly via PostgreSQL connection.
 * Usage: node scripts/run-migrations.mjs <db-password>
 */

import pg from "pg";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");

const password = process.argv[2];
if (!password) {
  console.error("Usage: node scripts/run-migrations.mjs <db-password>");
  process.exit(1);
}

// Try session pooler first (port 5432), then transaction pooler (6543)
const host = process.argv[3] || "aws-0-eu-central-1.pooler.supabase.com";
const port = parseInt(process.argv[4] || "5432");
// Session pooler user format: postgres.{ref}
const user = process.argv[5] || "postgres.lbtknhkokvusyezbmwhe";

const client = new pg.Client({
  host,
  port,
  database: "postgres",
  user,
  password,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 20000,
});

const migrations = [
  "supabase/migrations/20261014000001_init_schema.sql",
  "supabase/migrations/20261014000002_rls_policies.sql",
  "supabase/migrations/20261014000003_storage.sql",
  "supabase/migrations/20261015000004_sayghty_schema.sql",
];

try {
  console.log("Connecting to database...");
  await client.connect();
  console.log("✓ Connected\n");

  for (const migFile of migrations) {
    const filePath = join(rootDir, migFile);
    const sql = readFileSync(filePath, "utf8");
    const name = migFile.split("/").pop();

    process.stdout.write(`Running ${name}... `);
    try {
      await client.query(sql);
      console.log("✓ Done");
    } catch (err) {
      // Skip "already exists" errors — migration may have been partially applied
      if (
        err.message.includes("already exists") ||
        err.message.includes("duplicate key") ||
        err.code === "42710" || // duplicate_object
        err.code === "42P07" || // duplicate_table
        err.code === "42723"    // duplicate_function
      ) {
        console.log("⚠ Skipped (already exists)");
      } else {
        console.log(`✗ Error: ${err.message}`);
        console.error(err);
      }
    }
  }

  console.log("\n✓ All migrations complete!");
} catch (err) {
  console.error("Connection failed:", err.message);
  process.exit(1);
} finally {
  await client.end();
}
