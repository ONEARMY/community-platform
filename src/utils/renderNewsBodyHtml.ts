import type { DBNews } from 'oa-shared';
import { processStandaloneYouTubeUrls, processYouTubeLinks } from 'oa-shared';
import { renderTiptapHtml } from './renderTiptapHtml';

/**
 * Renders a news row's `content` (Tiptap JSON) to HTML. Assumes every published row has
 * been backfilled to `content` before this ships — there is no Markdown/`body` fallback.
 * `content` can still legitimately be null for a draft that hasn't had any body text
 * typed yet, so that case renders as empty rather than throwing.
 * Passed into `News.fromDB` so the Tiptap-specific rendering stays out of the shared
 * model (`oa-shared` has no Tiptap dependency). Pure string building — no DOM, so this
 * works identically on the server and in the browser.
 */
export const renderNewsBodyHtml = (news: Pick<DBNews, 'content'>): string => {
  let html = news.content ? renderTiptapHtml(news.content) : '';

  html = processYouTubeLinks(html);
  html = processStandaloneYouTubeUrls(html);

  return html;
};
