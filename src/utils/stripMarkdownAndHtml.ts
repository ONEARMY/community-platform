import { marked } from 'marked';

/**
 * Strips HTML tags and Markdown formatting from text, returning plain text.
 * This is useful for cleaning summaries and excerpts that may contain formatting.
 * 
 * Uses marked.parse() to convert markdown to HTML first, which handles all markdown
 * edge cases, then strips the HTML tags and decodes entities.
 *
 * @param text - The text to clean (may contain HTML tags and Markdown formatting)
 * @returns Plain text with all HTML tags and Markdown formatting removed
 */
export const stripMarkdownAndHtml = (text: string | null | undefined): string => {
  if (!text) {
    return '';
  }

  let cleaned = text;

  // First, convert markdown to HTML using marked.parse()
  // This handles all markdown edge cases that marked already knows about
  try {
    cleaned = marked.parse(cleaned, {
      breaks: true,
      gfm: true,
    }) as string;
  } catch (error) {
    // If parsing fails, fall back to original text
    // This shouldn't happen in normal cases, but provides a safety net
    console.warn('Failed to parse markdown:', error);
  }

  // Extract alt text from images before removing HTML tags
  // marked.parse() converts ![alt](url) to <img alt="alt" src="url">
  cleaned = cleaned.replace(/<img[^>]*alt=["']([^"']*)["'][^>]*>/gi, '$1');

  // Replace <br> and </p><p> with spaces to preserve line breaks as spaces
  cleaned = cleaned.replace(/<br\s*\/?>/gi, ' ');
  cleaned = cleaned.replace(/<\/p>\s*<p>/gi, ' ');

  // Remove HTML tags (including self-closing tags)
  // This regex matches <tag>content</tag> and <tag /> patterns
  cleaned = cleaned.replace(/<[^>]*>/g, '');

  // Clean up extra whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  // Decode HTML entities (common ones)
  // Decode &amp; first in a loop to handle double-encoded entities like &amp;amp; and &amp;lt;
  // Then decode other entities
  while (cleaned.includes('&amp;')) {
    cleaned = cleaned.replace(/&amp;/g, '&');
  }
  
  cleaned = cleaned
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");

  return cleaned;
};
