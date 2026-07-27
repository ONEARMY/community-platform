import { marked } from 'marked';

const MAX_SUMMARY_LENGTH = 160;
const MIN_SUMMARY_LENGTH = 50;

export const getSummaryFromMarkdown = (text: string) => {
  if (!text) {
    return null;
  }

  // Parse markdown into tokens
  const tokens = marked.lexer(text);
  const textParts: string[] = [];

  // Extract text from all tokens until we have enough content
  for (const token of tokens) {
    let tokenText = '';

    // Handle different token types
    if ('tokens' in token && token.tokens) {
      // Extract text from nested tokens (paragraphs, headings, etc.)
      tokenText = token.tokens
        .map((t: any) => t.text || '')
        .join(' ')
        .trim();
    } else if ('text' in token) {
      // Direct text tokens
      tokenText = (token as any).text.trim();
    } else if ('items' in token) {
      // Handle list items
      tokenText = (token as any).items
        .map((item: any) => item.tokens?.map((t: any) => t.text || '').join(' ') || '')
        .join(' ')
        .trim();
    }

    if (tokenText) {
      textParts.push(tokenText);

      // Stop once we have enough content
      const currentLength = textParts.join(' ').length;
      if (currentLength >= MIN_SUMMARY_LENGTH) {
        break;
      }
    }
  }

  // Join parts and clean up markdown formatting
  let summary = textParts
    .join(' ')
    .replaceAll('*', '')
    .replaceAll('_', '')
    .replaceAll('~~', '')
    .replaceAll('`', '')
    .replaceAll('<u>', '')
    .replaceAll('</u>', '')
    .replaceAll('<code>', '')
    .replaceAll('</code>', '')
    .trim();

  // Truncate to max length at word boundary
  if (summary.length > MAX_SUMMARY_LENGTH) {
    summary = summary.slice(0, MAX_SUMMARY_LENGTH);

    // Find the last space to avoid cutting mid-word
    const lastSpace = summary.lastIndexOf(' ');
    if (lastSpace > MIN_SUMMARY_LENGTH) {
      summary = summary.slice(0, lastSpace);
    }

    // Add ellipsis if truncated
    summary = summary.trim() + '...';
  }

  return summary || null;
};
