import type { JSONContent } from '@tiptap/core';
import { extractPlainTextFromTiptapJson } from './extractPlainTextFromTiptapJson';

const MAX_SUMMARY_LENGTH = 160;
const MIN_SUMMARY_LENGTH = 50;

export const getSummaryFromTiptapJson = (doc: JSONContent | null | undefined) => {
  const text = extractPlainTextFromTiptapJson(doc);

  if (!text) {
    return null;
  }

  let summary = text;

  if (summary.length > MAX_SUMMARY_LENGTH) {
    summary = summary.slice(0, MAX_SUMMARY_LENGTH);

    // Find the last space to avoid cutting mid-word
    const lastSpace = summary.lastIndexOf(' ');
    if (lastSpace > MIN_SUMMARY_LENGTH) {
      summary = summary.slice(0, lastSpace);
    }

    summary = summary.trim() + '...';
  }

  return summary || null;
};
