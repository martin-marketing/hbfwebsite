import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
function parseEnv(p){const o={};if(!existsSync(p))return o;for(const l of readFileSync(p,'utf8').split('\n')){const t=l.trim();if(!t||t.startsWith('#'))continue;const i=t.indexOf('=');if(i<0)continue;o[t.slice(0,i).trim()]=t.slice(i+1).trim().replace(/^["']|["']$/g,'');}return o;}
const env={...parseEnv('.env'),...parseEnv('.env.local')};
const sb=createClient(env.SUPABASE_URL, env.service_role_key||env.SERVICE_ROLE_KEY,{auth:{persistSession:false}});

const args = process.argv.slice(2);
const dry = args.includes('--dry-run');
const slugs = args.filter(a=>!a.startsWith('--'));
if(!slugs.length){console.error('usage: node fix-embeds.mjs <slug...> [--dry-run]');process.exit(1);}

function videoId(u){
  let m = u.match(/youtu\.be\/([A-Za-z0-9_-]{6,})/); if(m) return m[1];
  m = u.match(/[?&]v=([A-Za-z0-9_-]{6,})/); if(m) return m[1];
  return null;
}

for(const slug of slugs){
  const {data:row,error} = await sb.from('posts').select('id,slug,title,body').eq('slug',slug).single();
  if(error||!row){console.error(`SKIP ${slug}: ${error?.message??'not found'}`);continue;}
  let body = row.body||'';
  const found=[];
  // Replace the shortcode, unwrapping a <p> that contains only the shortcode.
  const next = body.replace(
    /(?:<p>\s*)?\[embed\]\s*(\S+?)\s*\[\/embed\](?:\s*<\/p>)?/g,
    (whole, url) => {
      const id = videoId(url);
      if(!id){ found.push(`UNPARSED ${url}`); return whole; }
      found.push(id);
      return `<div class="hbf-embed"><iframe src="https://www.youtube.com/embed/${id}" title="${row.title.replace(/"/g,'&quot;')}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>`;
    }
  );
  if(next===body){console.log(`${slug}: no change`);continue;}
  console.log(`${slug}: ${found.join(', ')}  (${body.length} -> ${next.length} chars)`);
  if(dry) continue;
  mkdirSync('.article-backups',{recursive:true});
  const stamp=new Date().toISOString().replace(/[:.]/g,'-');
  writeFileSync(`.article-backups/${slug}-${stamp}.html`, body);
  const {error:e2}=await sb.from('posts').update({body:next, updated_at:new Date().toISOString()}).eq('id',row.id);
  if(e2){console.error(`  update failed: ${e2.message}`);continue;}
  console.log('  updated ✓ (backed up)');
}
