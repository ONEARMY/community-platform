import { describe, expect, it } from 'vitest';

import { extractYouTubeId, processStandaloneYouTubeUrls, processYouTubeLinks } from './markdown';

describe('DisplayMarkdown utils', () => {
  describe('extractYouTubeId', () => {
    it('should extract video ID from youtube.com/watch URL', () => {
      const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
      expect(extractYouTubeId(url)).toBe('dQw4w9WgXcQ');
    });

    it('should extract video ID from youtu.be URL', () => {
      const url = 'https://youtu.be/dQw4w9WgXcQ';
      expect(extractYouTubeId(url)).toBe('dQw4w9WgXcQ');
    });

    it('should return null for invalid URLs', () => {
      const url = 'https://example.com/video';
      expect(extractYouTubeId(url)).toBeNull();
    });
  });

  describe('processYouTubeLinks', () => {
    it('should convert YouTube links to iframe embeds', () => {
      const html = '<a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">Video</a>';
      const result = processYouTubeLinks(html);

      expect(result).toContain('<iframe');
      expect(result).toContain('https://www.youtube.com/embed/dQw4w9WgXcQ');
      expect(result).toContain('allowfullscreen');
    });

    it('should preserve non-YouTube links', () => {
      const html = '<a href="https://example.com">Example</a>';
      const result = processYouTubeLinks(html);

      expect(result).toBe(html);
    });
  });

  describe('processStandaloneYouTubeUrls', () => {
    it('should convert standalone YouTube URLs to iframe embeds', () => {
      const html = 'Check this out: https://www.youtube.com/watch?v=dQw4w9WgXcQ';
      const result = processStandaloneYouTubeUrls(html);

      expect(result).toContain('<iframe');
      expect(result).toContain('https://www.youtube.com/embed/dQw4w9WgXcQ');
    });

    it('should not process URLs already in links', () => {
      const html = '<a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">Video</a>';
      const result = processStandaloneYouTubeUrls(html);

      expect(result).toBe(html);
    });
  });
});
