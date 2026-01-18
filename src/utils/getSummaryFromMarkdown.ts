import { marked } from 'marked';

export const getSummaryFromMarkdown = (text: string) => {
  // Works for headings, paragraphs, etc.
  // Doesn't work for at list items and maybe more.

  if (!text) {
    return null;
  }
  // has to go to any as unhelpfully typed
  const linesWithTokens = marked
    .lexer(text)
    .filter(({ tokens }: any) => !!tokens && tokens.length > 0);
  const linesWithText = linesWithTokens.map((line: any) => line.tokens).flat();

  const flattenedLines = linesWithText
    .slice(0, 3)
    .map((token) => token['text'] && token['text'].trim());

  return flattenedLines
    .join(' ')
    .replaceAll('*', '')
    .replaceAll('_', '')
    .replaceAll('~~', '')
    .replaceAll('`', '')
    .replaceAll('<u>', '')
    .replaceAll('</u>', '')
    .replaceAll('<code>', '')
    .replaceAll('</code>', '');
};
