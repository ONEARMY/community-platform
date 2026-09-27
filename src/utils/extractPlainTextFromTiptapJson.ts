import type { JSONContent } from '@tiptap/core';

export const extractPlainTextFromTiptapJson = (doc: JSONContent | null | undefined): string => {
  if (!doc) {
    return '';
  }

  const parts: string[] = [];

  const walk = (node: JSONContent) => {
    if (typeof node.text === 'string') {
      parts.push(node.text);
    }
    node.content?.forEach(walk);
  };

  walk(doc);

  return parts.join(' ').replace(/\s+/g, ' ').trim();
};
