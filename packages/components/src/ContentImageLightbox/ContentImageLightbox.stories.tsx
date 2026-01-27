import { ContentImageLightbox } from './ContentImageLightbox';

import type { Meta, StoryFn } from '@storybook/react-vite';

export default {
  title: 'Layout/ContentImageLightbox',
  component: ContentImageLightbox,
} as Meta<typeof ContentImageLightbox>;

const sampleImages = [
  'https://picsum.photos/id/29/800/600',
  'https://picsum.photos/id/50/800/600',
  'https://picsum.photos/id/110/800/600',
];

export const Default: StoryFn<typeof ContentImageLightbox> = () => (
  <ContentImageLightbox>
    <div>
      <h2>Sample Content with Images</h2>
      <p>Click on any image to open the lightbox view.</p>
      <img src={sampleImages[0]} alt="Sample image 1" style={{ maxWidth: '100%', marginBottom: '1rem' }} />
      <p>This is some text between images.</p>
      <img src={sampleImages[1]} alt="Sample image 2" style={{ maxWidth: '100%', marginBottom: '1rem' }} />
    </div>
  </ContentImageLightbox>
);

export const MultipleImages: StoryFn<typeof ContentImageLightbox> = () => (
  <ContentImageLightbox>
    <div>
      <h2>Multiple Images</h2>
      <p>Navigate through multiple images using the lightbox controls.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
        {sampleImages.map((src, index) => (
          <img key={index} src={src} alt={`Sample image ${index + 1}`} style={{ maxWidth: '100%' }} />
        ))}
      </div>
    </div>
  </ContentImageLightbox>
);

export const WithRichContent: StoryFn<typeof ContentImageLightbox> = () => (
  <ContentImageLightbox>
    <article style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
      <h1>Article with Images</h1>
      <p>
        This demonstrates how the ContentImageLightbox component works with rich content containing
        multiple images throughout the text.
      </p>
      <img src={sampleImages[0]} alt="Hero image" style={{ maxWidth: '100%', marginBottom: '1rem' }} />
      <h2>Section 1</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua.
      </p>
      <img src={sampleImages[1]} alt="Section image" style={{ maxWidth: '100%', margin: '1rem 0' }} />
      <h2>Section 2</h2>
      <p>
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </p>
      <img src={sampleImages[2]} alt="Another image" style={{ maxWidth: '100%', marginTop: '1rem' }} />
    </article>
  </ContentImageLightbox>
);

export const CustomSelector: StoryFn<typeof ContentImageLightbox> = () => (
  <ContentImageLightbox selector=".lightbox-image">
    <div>
      <h2>Custom Selector Example</h2>
      <p>Only images with the "lightbox-image" class will open in the lightbox.</p>
      <img
        src={sampleImages[0]}
        alt="Lightbox enabled"
        className="lightbox-image"
        style={{ maxWidth: '100%', marginBottom: '1rem' }}
      />
      <p>This image below will NOT open in lightbox (no class):</p>
      <img src={sampleImages[1]} alt="No lightbox" style={{ maxWidth: '100%', opacity: 0.5 }} />
    </div>
  </ContentImageLightbox>
);
