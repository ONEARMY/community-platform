/**
 * One-off backfill: converts existing `news.body` Markdown into Tiptap JSON and writes
 * it to the new `content`/`content_search_text`/`summary` columns. Never touches `body` itself.
 *
 * This is NOT run automatically
 *
 * Usage:
 *   npx tsx scripts/backfill-news-content.ts            # only TEST_ARTICLE_IDS
 *   npx tsx scripts/backfill-news-content.ts --all       # every row missing `content`
 *
 * Reversible: `UPDATE news SET content = NULL, content_search_text = NULL, summary = NULL WHERE id IN (...)`.
 */
import { createClient } from '@supabase/supabase-js';
import { generateJSON } from '@tiptap/html';
import { marked } from 'marked';
import { extractPlainTextFromTiptapJson } from '../src/utils/extractPlainTextFromTiptapJson';
import { getSummaryFromTiptapJson } from '../src/utils/getSummaryFromTiptapJson';
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
    const markdownHtml = marked(row.body, { breaks: true, gfm: true }) as string;
    // The heading extension only supports levels 2-4 (see TIPTAP_EXTENSIONS), so any
    // `# heading` in the source Markdown must become h2 here or it won't parse as a heading.
    const html = markdownHtml
      .replaceAll(/<h1(\s[^>]*)?>/gi, '<h2$1>')
      .replaceAll(/<\/h1>/gi, '</h2>');
    const json = generateJSON(html, TIPTAP_EXTENSIONS);
    const plainText = extractPlainTextFromTiptapJson(json);
    const summary = getSummaryFromTiptapJson(json);

    const { error: updateError } = await client
      .from('news')
      .update({ content: json, content_search_text: plainText, summary })
      .eq('id', row.id);

    if (updateError) {
      console.error(`✗ failed news ${row.id}`, updateError);
    } else {
      console.log(`✓ backfilled news ${row.id}`);
    }
  }
}

main();
