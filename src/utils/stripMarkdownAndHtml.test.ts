import { describe, expect, it } from 'vitest';

import { stripMarkdownAndHtml } from './stripMarkdownAndHtml';

describe('stripMarkdownAndHtml', () => {
  it('should return empty string for null or undefined', () => {
    expect(stripMarkdownAndHtml(null)).toBe('');
    expect(stripMarkdownAndHtml(undefined)).toBe('');
  });

  it('should remove HTML tags', () => {
    expect(stripMarkdownAndHtml('<u>underlined</u> text')).toBe('underlined text');
    expect(stripMarkdownAndHtml('<i>italic</i> text')).toBe('italic text');
    expect(stripMarkdownAndHtml('<b>bold</b> text')).toBe('bold text');
    expect(stripMarkdownAndHtml('<strong>strong</strong> text')).toBe('strong text');
    expect(stripMarkdownAndHtml('<p>paragraph</p>')).toBe('paragraph');
    expect(stripMarkdownAndHtml('<div>content</div>')).toBe('content');
  });

  it('should remove Markdown bold formatting', () => {
    expect(stripMarkdownAndHtml('**bold text**')).toBe('bold text');
    expect(stripMarkdownAndHtml('__bold text__')).toBe('bold text');
    expect(stripMarkdownAndHtml('This is **bold** text')).toBe('This is bold text');
  });

  it('should remove Markdown italic formatting', () => {
    expect(stripMarkdownAndHtml('*italic text*')).toBe('italic text');
    expect(stripMarkdownAndHtml('_italic text_')).toBe('italic text');
    expect(stripMarkdownAndHtml('This is *italic* text')).toBe('This is italic text');
  });

  it('should remove Markdown bold + italic formatting', () => {
    expect(stripMarkdownAndHtml('***bold italic text***')).toBe('bold italic text');
    expect(stripMarkdownAndHtml('___bold italic text___')).toBe('bold italic text');
    expect(stripMarkdownAndHtml('This is ***bold italic*** text')).toBe('This is bold italic text');
    expect(stripMarkdownAndHtml('***Word***')).toBe('Word');
  });

  it('should remove Markdown strikethrough', () => {
    expect(stripMarkdownAndHtml('~~strikethrough~~')).toBe('strikethrough');
    expect(stripMarkdownAndHtml('This is ~~strikethrough~~ text')).toBe('This is strikethrough text');
  });

  it('should remove Markdown headers', () => {
    expect(stripMarkdownAndHtml('# Header')).toBe('Header');
    expect(stripMarkdownAndHtml('## Header')).toBe('Header');
    expect(stripMarkdownAndHtml('### Header')).toBe('Header');
    expect(stripMarkdownAndHtml('#### Header')).toBe('Header');
  });

  it('should remove Markdown links', () => {
    expect(stripMarkdownAndHtml('[link text](https://example.com)')).toBe('link text');
    expect(stripMarkdownAndHtml('Check out [this link](https://example.com)')).toBe('Check out this link');
  });

  it('should remove Markdown images', () => {
    expect(stripMarkdownAndHtml('![alt text](image.jpg)')).toBe('alt text');
    expect(stripMarkdownAndHtml('See ![this image](image.jpg)')).toBe('See this image');
  });

  it('should remove Markdown code', () => {
    expect(stripMarkdownAndHtml('`code`')).toBe('code');
    expect(stripMarkdownAndHtml('This is `code` text')).toBe('This is code text');
  });

  it('should remove Markdown lists', () => {
    expect(stripMarkdownAndHtml('- list item')).toBe('list item');
    expect(stripMarkdownAndHtml('* list item')).toBe('list item');
    expect(stripMarkdownAndHtml('+ list item')).toBe('list item');
    expect(stripMarkdownAndHtml('1. numbered item')).toBe('numbered item');
  });

  it('should remove Markdown blockquotes', () => {
    expect(stripMarkdownAndHtml('> quoted text')).toBe('quoted text');
  });

  it('should handle complex combinations', () => {
    expect(stripMarkdownAndHtml('**Bold** and <i>italic</i> text')).toBe('Bold and italic text');
    expect(stripMarkdownAndHtml('<u>Underlined</u> **bold** text')).toBe('Underlined bold text');
    expect(stripMarkdownAndHtml('Check [this link](url) and **bold** text')).toBe('Check this link and bold text');
  });

  it('should decode HTML entities', () => {
    expect(stripMarkdownAndHtml('&amp;')).toBe('&');
    expect(stripMarkdownAndHtml('&lt;')).toBe('<');
    expect(stripMarkdownAndHtml('&gt;')).toBe('>');
    expect(stripMarkdownAndHtml('&quot;')).toBe('"');
    expect(stripMarkdownAndHtml('&#39;')).toBe("'");
    expect(stripMarkdownAndHtml('&nbsp;')).toBe(' ');
  });

  it('should handle double-encoded HTML entities correctly', () => {
    // &amp; should be decoded last to avoid double-unescaping
    expect(stripMarkdownAndHtml('&amp;amp;')).toBe('&');
    expect(stripMarkdownAndHtml('&amp;lt;')).toBe('<');
    expect(stripMarkdownAndHtml('&amp;gt;')).toBe('>');
    expect(stripMarkdownAndHtml('&amp;quot;')).toBe('"');
  });

  it('should clean up extra whitespace', () => {
    expect(stripMarkdownAndHtml('  multiple   spaces  ')).toBe('multiple spaces');
    expect(stripMarkdownAndHtml('text\n\nwith\nnewlines')).toBe('text with newlines');
  });

  it('should handle empty strings', () => {
    expect(stripMarkdownAndHtml('')).toBe('');
  });

  it('should handle real-world examples', () => {
    const example1 = '**Breaking News**: <u>Important</u> announcement about <i>climate</i> change.';
    expect(stripMarkdownAndHtml(example1)).toBe('Breaking News: Important announcement about climate change.');

    const example2 = 'Check out [this article](https://example.com) for **more** details.';
    expect(stripMarkdownAndHtml(example2)).toBe('Check out this article for more details.');
  });
});
