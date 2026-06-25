#!/usr/bin/env node
/**
 * Publish a blog article to the redesign site (Supabase + Vercel).
 *
 * The live page renders Supabase `posts.body`, NOT the repo HTML file, and a
 * git push does NOT redeploy on its own. This script does the whole dance:
 *   1. read blog articles/<slug>_article_wp.html
 *   2. back up the current Supabase posts.body
 *   3. update posts.body + updated_at for that slug
 *   4. trigger a Vercel production deploy (unless --no-deploy)
 *
 * Usage:
 *   npm run publish:article -- <slug> [--no-deploy] [--dry-run]
 *   node scripts/publish-article.mjs life-insurance-financial-safety-net
 *
 * <slug> matches Supabase posts.slug and the file prefix, e.g.
 *   life-insurance-financial-safety-net  ->  blog articles/life-insurance-financial-safety-net_article_wp.html
 *
 * Needs SUPABASE_URL + a service role key (service_role_key or SERVICE_ROLE_KEY)
 * in .env / .env.local. Verify at https://hbfwebsite.vercel.app/<slug>/
 * (heidiblondin.com is still the old WordPress site and will NOT reflect this).
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function parseEnv(path) {
  const out = {};
  if (!existsSync(path)) return out;
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i === -1) continue;
    out[t.slice(0, i).trim()] = t.slice(i + 1).trim().replace(/^["']|["']$/g, '');
  }
  return out;
}

const args = process.argv.slice(2);
const slug = args.find((a) => !a.startsWith('--'));
const deploy = !args.includes('--no-deploy');
const dryRun = args.includes('--dry-run');

if (!slug) {
  console.error('Usage: npm run publish:article -- <slug> [--no-deploy] [--dry-run]');
  process.exit(1);
}

const env = { ...parseEnv(join(root, '.env')), ...parseEnv(join(root, '.env.local')) };
const url = env.SUPABASE_URL;
const key = env.service_role_key || env.SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('Missing SUPABASE_URL or service role key in .env / .env.local');
  process.exit(1);
}

const filePath = join(root, 'blog articles', `${slug}_article_wp.html`);
if (!existsSync(filePath)) {
  console.error(`Article file not found: ${filePath}`);
  process.exit(1);
}
const body = readFileSync(filePath, 'utf8');

const sb = createClient(url, key, { auth: { persistSession: false } });

const { data: row, error: readErr } = await sb
  .from('posts')
  .select('id, slug, title, updated_at, body')
  .eq('slug', slug)
  .single();
if (readErr || !row) {
  console.error(`No posts row with slug "${slug}" (update-only; create it in Supabase first).`, readErr?.message ?? '');
  process.exit(1);
}

console.log(`Article : ${row.title}`);
console.log(`Slug    : ${row.slug}  (id ${row.id})`);
console.log(`Body    : ${row.body?.length ?? 0} -> ${body.length} chars`);

if (dryRun) {
  console.log('Dry run: no changes written.');
  process.exit(0);
}

// Back up the current body so the update is reversible.
const backupDir = join(root, '.article-backups');
mkdirSync(backupDir, { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupPath = join(backupDir, `${slug}-${stamp}.html`);
writeFileSync(backupPath, row.body ?? '');
console.log(`Backup  : ${backupPath}`);

const { error: updErr } = await sb
  .from('posts')
  .update({ body, updated_at: new Date().toISOString() })
  .eq('id', row.id);
if (updErr) {
  console.error('Update failed:', updErr.message);
  process.exit(1);
}
console.log('Supabase: updated ✓');

if (deploy) {
  console.log('Deploying to Vercel production (npx vercel --prod --yes)...');
  try {
    execSync('npx vercel --prod --yes', { cwd: root, stdio: 'inherit' });
  } catch {
    console.error('\nVercel deploy failed. Run `npx vercel login`, then `npx vercel --prod --yes` manually.');
    process.exit(1);
  }
}
console.log(`\nVerify: https://hbfwebsite.vercel.app/${slug}/`);
if (!deploy) console.log('Deploy skipped (--no-deploy). To publish: npx vercel --prod --yes');
