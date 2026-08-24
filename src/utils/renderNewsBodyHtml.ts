import type { DBNews } from 'oa-shared';
import { processStandaloneYouTubeUrls, processYouTubeLinks } from 'oa-shared';
import { renderTiptapHtml } from './renderTiptapHtml';

/**
 * Renders a news row's `content` (Tiptap JSON) to HTML. Assumes every row has been
 * backfilled to `content` before this ships — there is no Markdown/`body` fallback.
 * Passed into `News.fromDB` so the Tiptap-specific rendering stays out of the shared
 * model (`oa-shared` has no Tiptap dependency). Pure string building — no DOM, so this
 * works identically on the server and in the browser.
 */
export const renderNewsBodyHtml = (news: Pick<DBNews, 'content'>): string => {
  let html = renderTiptapHtml(news.content!);

  html = processYouTubeLinks(html);
  html = processStandaloneYouTubeUrls(html);

  return html;
};
