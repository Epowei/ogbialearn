import postgres from "postgres";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const regions = [
  "us-east-1", "us-east-2", "us-west-1", "us-west-2",
  "eu-west-1", "eu-west-2", "eu-central-1", 
  "ap-southeast-1", "ap-south-1", "ap-northeast-1",
  "sa-east-1", "af-south-1"
];

const password = "uG5FM5aWCSaQhTEh";
const ref = "rabwxchnqhjwbvsrkfej";

async function tryRegion(region: string): Promise<boolean> {
  const url = `postgresql://postgres.${ref}:${password}@aws-0-${region}.pooler.supabase.com:5432/postgres`;
  const sql = postgres(url, { ssl: "require", connect_timeout: 8 });
  try {
    await sql`SELECT 1 as test`;
    console.log(`✅ ${region} - CONNECTED!`);
    await sql.end();
    return true;
  } catch (e: any) {
    console.log(`❌ ${region} - ${e.message?.substring(0, 50)}`);
    await sql.end({ timeout: 1 });
    return false;
  }
}

async function main() {
  console.log("Testing Supabase pooler regions...\n");
  for (const region of regions) {
    const ok = await tryRegion(region);
    if (ok) {
      console.log(`\nUse this DATABASE_URL:`);
      console.log(`postgresql://postgres.${ref}:${password}@aws-0-${region}.pooler.supabase.com:5432/postgres`);
      break;
    }
  }
}

main();
