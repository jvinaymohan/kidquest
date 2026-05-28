#!/usr/bin/env node
/**
 * Apply supabase/schema.sql to the linked Supabase Postgres database.
 *
 * Requires one of:
 *   SUPABASE_DB_URL=postgresql://postgres:PASSWORD@db.REF.supabase.co:5432/postgres
 *   SUPABASE_PROJECT_REF + SUPABASE_DB_PASSWORD
 *
 * Password: Supabase Dashboard → Project Settings → Database → Database password
 */

import fs from "node:fs";
import path from "node:path";
import dns from "node:dns/promises";
import { fileURLToPath } from "node:url";
import postgres from "postgres";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SCHEMA_PATH = path.join(ROOT, "supabase", "schema.sql");

function loadEnvFile(filePath, { override = false } = {}) {
  if (!fs.existsSync(filePath)) return;
  const text = fs.readFileSync(filePath, "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (override || !(key in process.env)) process.env[key] = value;
  }
}

// .env.local always wins (unsaved editor buffers are a common cause of "wrong password")
loadEnvFile(path.join(ROOT, ".env.local"), { override: true });
loadEnvFile(path.join(ROOT, ".env"));

function projectRefFromUrl(url) {
  try {
    const host = new URL(url).hostname;
    const m = host.match(/^([a-z0-9]+)\.supabase\.co$/i);
    return m?.[1] ?? null;
  } catch {
    return null;
  }
}

function resolveConnectionString() {
  if (process.env.SUPABASE_DB_URL) return process.env.SUPABASE_DB_URL;

  const password = process.env.SUPABASE_DB_PASSWORD?.trim();
  const ref =
    process.env.SUPABASE_PROJECT_REF ||
    projectRefFromUrl(process.env.VITE_SUPABASE_URL ?? "");

  if (password && ref) {
    return `postgresql://postgres:${encodeURIComponent(password)}@db.${ref}.supabase.co:5432/postgres`;
  }

  return null;
}

async function resolveDbHost(ref) {
  const hostname = `db.${ref}.supabase.co`;
  let hasIPv4 = false;
  let hasIPv6 = false;
  try {
    const { address } = await dns.lookup(hostname, { family: 4 });
    hasIPv4 = true;
    return { hostname, connectHost: address, hasIPv4, hasIPv6 };
  } catch {
    /* no A record */
  }
  try {
    await dns.lookup(hostname, { family: 6 });
    hasIPv6 = true;
  } catch {
    /* no AAAA */
  }
  return { hostname, connectHost: hostname, hasIPv4, hasIPv6 };
}

function printIpv6Help(ref) {
  console.error(`
Your network cannot reach Supabase direct DB (IPv6-only: db.${ref}.supabase.co).

Fix (pick one):

  1) Session pooler (IPv4) — recommended
     Supabase Dashboard → Project Settings → Database → Connection string
     Choose "Session pooler" / URI, copy the full URL, then add to .env.local:

       SUPABASE_DB_POOLER_URL=postgresql://postgres.${ref}:YOUR_PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres

     Then run: npm run db:apply

  2) Enable IPv4 add-on
     Dashboard → Project Settings → Database → IPv4 add-on (if on your plan)

  3) Manual apply
     Dashboard → SQL Editor → paste contents of supabase/schema.sql → Run
`);
}

function resolvePoolerUrl() {
  const raw = process.env.SUPABASE_DB_POOLER_URL?.trim();
  if (raw && !/\[YOUR[-_]?PASSWORD\]/i.test(raw)) return raw;

  const password = process.env.SUPABASE_DB_PASSWORD?.trim();
  const ref =
    process.env.SUPABASE_PROJECT_REF ||
    projectRefFromUrl(process.env.VITE_SUPABASE_URL ?? "");
  const host =
    process.env.SUPABASE_DB_POOLER_HOST || "aws-1-us-east-2.pooler.supabase.com";

  if (password && ref) {
    return `postgresql://postgres.${ref}:${encodeURIComponent(password)}@${host}:5432/postgres`;
  }
  return raw || null;
}

async function openDatabase() {
  const poolerUrl = resolvePoolerUrl();
  if (poolerUrl) {
    console.log("  Using Session pooler (SUPABASE_DB_POOLER_URL or host + password)");
    return postgres(poolerUrl, {
      ssl: "require",
      max: 1,
      idle_timeout: 5,
      connect_timeout: 30,
    });
  }

  const connectionString = resolveConnectionString();
  if (connectionString && process.env.SUPABASE_DB_URL) {
    return postgres(connectionString, {
      ssl: "require",
      max: 1,
      idle_timeout: 5,
      connect_timeout: 30,
    });
  }

  const password = process.env.SUPABASE_DB_PASSWORD?.trim();
  const ref =
    process.env.SUPABASE_PROJECT_REF ||
    projectRefFromUrl(process.env.VITE_SUPABASE_URL ?? "");

  if (!password || !ref) return null;

  const { hostname, connectHost, hasIPv4, hasIPv6 } = await resolveDbHost(ref);
  if (connectHost !== hostname) {
    console.log(`  Resolved ${hostname} → ${connectHost} (IPv4)`);
  } else if (!hasIPv4 && hasIPv6) {
    console.warn(`  Warning: ${hostname} has no IPv4 address (IPv6 only).`);
  }

  return postgres({
    host: connectHost,
    port: 5432,
    database: "postgres",
    user: "postgres",
    password,
    ssl: connectHost === hostname ? "require" : { rejectUnauthorized: true, servername: hostname },
    max: 1,
    idle_timeout: 5,
    connect_timeout: 30,
  });
}

async function pingOnly() {
  const poolerUrl = resolvePoolerUrl();
  if (!poolerUrl) {
    console.error("Missing pooler credentials in .env.local");
    process.exit(1);
  }
  const pw = process.env.SUPABASE_DB_PASSWORD?.trim();
  console.log(`Using ${ENV_PATH}`);
  console.log(`  Password loaded: ${pw ? `${pw.length} characters` : "missing"}`);
  console.log("  (Save .env.local with Cmd+S before running — unsaved edits are ignored)\n");
  try {
    const sql = postgres(poolerUrl, { ssl: "require", max: 1, connect_timeout: 15 });
    const row = await sql`select current_user as u, current_database() as d`;
    console.log(`✓ Connected as ${row[0].u} on ${row[0].d}`);
    await sql.end({ timeout: 5 });
    process.exit(0);
  } catch (err) {
    console.error("✗", err?.message ?? err);
    process.exit(1);
  }
}

const ENV_PATH = path.join(ROOT, ".env.local");

async function main() {
  if (process.argv.includes("--ping")) return pingOnly();

  const canConnect =
    process.env.SUPABASE_DB_URL ||
    process.env.SUPABASE_DB_POOLER_URL ||
    (process.env.SUPABASE_DB_PASSWORD &&
      (process.env.SUPABASE_DB_POOLER_HOST ||
        process.env.SUPABASE_PROJECT_REF ||
        process.env.VITE_SUPABASE_URL));

  if (!canConnect) {
    console.error(`
Missing database credentials.

Add to .env.local (gitignored):

  SUPABASE_DB_URL=postgresql://postgres:YOUR_PASSWORD@db.YOUR_REF.supabase.co:5432/postgres

Or:

  SUPABASE_PROJECT_REF=your_project_ref
  SUPABASE_DB_PASSWORD=your_database_password

Database password: Supabase → Project Settings → Database

If you see ECONNREFUSED on an IPv6 address, add Session pooler URL from
Dashboard → Database → Connection string → Session mode:

  SUPABASE_DB_POOLER_URL=postgresql://postgres.PROJECT_REF:PASSWORD@....pooler.supabase.com:5432/postgres
`);
    process.exit(1);
  }

  if (!fs.existsSync(SCHEMA_PATH)) {
    console.error(`Schema file not found: ${SCHEMA_PATH}`);
    process.exit(1);
  }

  const sql = await openDatabase();
  if (!sql) {
    console.error("Could not open database connection.");
    process.exit(1);
  }

  const ref =
    process.env.SUPABASE_PROJECT_REF ||
    projectRefFromUrl(process.env.VITE_SUPABASE_URL ?? "") ||
    "linked project";

  console.log(`Applying schema to ${ref}…`);
  console.log(`  File: supabase/schema.sql`);

  try {
    await sql.file(SCHEMA_PATH);
    console.log("✓ Schema applied successfully.");
  } catch (err) {
    console.error("✗ Schema apply failed:");
    console.error(err?.message ?? err);
    const msg = String(err?.message ?? "");
    if (/password authentication failed/i.test(msg)) {
      console.error(`
Database password rejected. Use the password from:
  Supabase Dashboard → Project Settings → Database → Database password
  (Reset password if unsure, then update SUPABASE_DB_PASSWORD in .env.local)
`);
    }
    if (msg.includes("ECONNREFUSED") && msg.includes(":")) {
      const ref =
        process.env.SUPABASE_PROJECT_REF ||
        projectRefFromUrl(process.env.VITE_SUPABASE_URL ?? "") ||
        "YOUR_PROJECT_REF";
      printIpv6Help(ref);
    }
    process.exit(1);
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main();
