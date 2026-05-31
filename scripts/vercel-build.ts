import { execSync } from "node:child_process";

function run(command: string) {
  console.log(`\n> ${command}`);
  execSync(command, { stdio: "inherit", env: process.env });
}

if (!process.env.DIRECT_URL && process.env.DATABASE_URL) {
  process.env.DIRECT_URL = process.env.DATABASE_URL;
}

try {
  run("npx prisma generate");

  if (!process.env.DATABASE_URL) {
    console.error(
      "\n[build] DATABASE_URL is missing.",
      "Set it in Vercel → Settings → Environment Variables (Neon PostgreSQL URL).",
    );
    process.exit(1);
  }

  run("npx prisma db push --skip-generate --accept-data-loss");
  run("npx prisma db seed");
  run("npx next build");
} catch {
  process.exit(1);
}
