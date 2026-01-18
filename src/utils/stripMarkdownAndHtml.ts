/**
 * Strips HTML tags and Markdown formatting from text, returning plain text.
 * This is useful for cleaning summaries and excerpts that may contain formatting.
 *
 * @param text - The text to clean (may contain HTML tags and Markdown formatting)
 * @returns Plain text with all HTML tags and Markdown formatting removed
 */
export const stripMarkdownAndHtml = (text: string | null | undefined): string => {
  if (!text) {
    return '';
  }

  let cleaned = text;

  // First, remove HTML tags (including self-closing tags)
  // This regex matches <tag>content</tag> and <tag /> patterns
  cleaned = cleaned.replace(/<[^>]*>/g, '');

  // Remove Markdown formatting:
  // - Bold: **text** or __text__ (must come before italic to avoid conflicts)
  cleaned = cleaned.replace(/\*\*([^*]+?)\*\*/g, '$1');
  cleaned = cleaned.replace(/__([^_]+?)__/g, '$1');

  // - Italic: *text* or _text_ (after bold to avoid matching ** as two italics)
  // Since bold markers (** and __) are already removed, match single markers
  // Use a simple pattern that avoids lookbehinds for better browser compatibility
  cleaned = cleaned.replace(/\*([^*\n]+?)\*/g, '$1');
  cleaned = cleaned.replace(/_([^_\n]+?)_/g, '$1');

  // - Strikethrough: ~~text~~
  cleaned = cleaned.replace(/~~([^~]+)~~/g, '$1');

  // - Headers: # Header, ## Header, etc.
  cleaned = cleaned.replace(/^#{1,6}\s+/gm, '');

  // - Images: ![alt](url) -> alt (must come before links to avoid conflicts)
  cleaned = cleaned.replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1');

  // - Links: [text](url) -> text
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // - Code blocks: `code` -> code
  cleaned = cleaned.replace(/`([^`]+)`/g, '$1');

  // - Code blocks: ```code``` -> code
  cleaned = cleaned.replace(/```[\s\S]*?```/g, '');

  // - Lists: - item, * item, + item, 1. item -> item
  cleaned = cleaned.replace(/^[\s]*[-*+]\s+/gm, '');
  cleaned = cleaned.replace(/^\d+\.\s+/gm, '');

  // - Blockquotes: > text -> text
  cleaned = cleaned.replace(/^>\s+/gm, '');

  // - Horizontal rules: ---, ***, ___
  cleaned = cleaned.replace(/^[-*_]{3,}$/gm, '');

  // Clean up extra whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  // Decode HTML entities (common ones)
  cleaned = cleaned
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");

  return cleaned;
};
