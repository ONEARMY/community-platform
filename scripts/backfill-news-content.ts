/**
 * One-off backfill: converts existing `news.body` Markdown into Tiptap JSON and writes
 * it to the new `content`/`content_search_text` columns. Never touches `body` itself.
 *
 * This is NOT run automatically
 *
 * Usage:
 *   npx tsx scripts/backfill-news-content.ts            # only TEST_ARTICLE_IDS
 *   npx tsx scripts/backfill-news-content.ts --all       # every row missing `content`
 *
 * Reversible: `UPDATE news SET content = NULL, content_search_text = NULL WHERE id IN (...)`.
 */
import { createClient } from '@supabase/supabase-js';
import { generateJSON } from '@tiptap/html';
import { marked } from 'marked';
import { extractPlainTextFromTiptapJson } from '../src/utils/extractPlainTextFromTiptapJson';
import { TIPTAP_EXTENSIONS } from '../src/utils/tiptapExtensions';

// Fill in with a handful of real article IDs before running without --all.
const TEST_ARTICLE_IDS: number[] = [];

const SUPABASE_API_URL = process.env.SUPABASE_API_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function main() {
  if (!SUPABASE_API_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_API_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
  }

  const runAll = process.argv.includes('--all');
  const client = createClient(SUPABASE_API_URL, SUPABASE_SERVICE_ROLE_KEY);

  let query = client.from('news').select('id, body').is('content', null);
  if (!runAll) {
    if (TEST_ARTICLE_IDS.length === 0) {
      throw new Error('Set TEST_ARTICLE_IDS before running without --all');
    }
    query = query.in('id', TEST_ARTICLE_IDS);
  }

  const { data: rows, error } = await query;
  if (error) {
    throw error;
  }

  for (const row of rows ?? []) {
    const html = marked(row.body, { breaks: true, gfm: true }) as string;
    const json = generateJSON(html, TIPTAP_EXTENSIONS);
    const plainText = extractPlainTextFromTiptapJson(json);

    const { error: updateError } = await client
      .from('news')
      .update({ content: json, content_search_text: plainText })
      .eq('id', row.id);

    if (updateError) {
      console.error(`✗ failed news ${row.id}`, updateError);
    } else {
      console.log(`✓ backfilled news ${row.id}`);
    }
  }
}

main();
