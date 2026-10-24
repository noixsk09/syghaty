import pg from "pg";

const client = new pg.Client({
  host: "aws-0-eu-west-1.pooler.supabase.com",
  port: 5432,
  database: "postgres",
  user: "postgres.lbtknhkokvusyezbmwhe",
  password: process.argv[2],
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 15000,
});

await client.connect();

const { rows } = await client.query(`
  SELECT tablename FROM pg_tables
  WHERE schemaname = 'public'
  ORDER BY tablename;
`);

console.log("Tables in database:");
rows.forEach(r => console.log(" ✓", r.tablename));

await client.end();
