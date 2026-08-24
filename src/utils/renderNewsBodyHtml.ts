import { marked } from 'marked';
import type { DBNews } from 'oa-shared';
import { processStandaloneYouTubeUrls, processYouTubeLinks } from 'oa-shared';
import { renderTiptapHtml } from './renderTiptapHtml';

/**
 * Renders a news row's body to HTML: `content` (Tiptap JSON) when present, falling back
 * to the legacy `marked(body)` Markdown path for rows that haven't been backfilled yet.
 * Passed into `News.fromDB` so the Tiptap-specific rendering stays out of the shared
 * model (`oa-shared` has no Tiptap dependency). Pure string building — no DOM, so this
 * works identically on the server and in the browser.
 */
export const renderNewsBodyHtml = (news: Pick<DBNews, 'body' | 'content'>): string => {
  let html = news.content
    ? renderTiptapHtml(news.content)
    : (marked(news.body, { breaks: true, gfm: true }) as string);

  html = processYouTubeLinks(html);
  html = processStandaloneYouTubeUrls(html);

  return html;
};
