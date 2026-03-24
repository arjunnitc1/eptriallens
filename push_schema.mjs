import { createClient } from '@libsql/client';
import fs from 'fs';

const client = createClient({
  url: "libsql://eptriallens-arjunnitc1.aws-eu-west-1.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzQxODk5MDAsImlkIjoiMDE5ZDE1ZjMtYzYwMS03NTM0LWE2NGItZWM4ZmFlZDBlNWMzIiwicmlkIjoiZDRlZDE5MGItYmNjOC00MzQxLWJmNjYtYjQ4ZTA1NmY0OGY3In0.dRLWwXQJsE0TaHxqoxut6sCdq00Wp0uUdTjtzygtncSfdoCgT15uRhDMepP-eJwUjDfyBoMnNEyo6NV2oi-oBw"
});

async function main() {
  const sql = fs.readFileSync('schema.sql', 'utf8');
  const statements = sql.split(';');
  
  for (let stmt of statements) {
    stmt = stmt.trim();
    if (stmt.length > 0) {
      try {
        await client.execute(stmt);
        console.log("Executed: ", stmt.slice(0, 50) + "...");
      } catch(e) {
        console.error("Error executing:", stmt.slice(0, 50), e.message);
      }
    }
  }
  console.log("Schema applied to Turso successfully!");
}

main().catch(console.error);
