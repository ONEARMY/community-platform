import type { DBNews } from '../../models/news';

export const news: Partial<DBNews>[] = [
  {
    body: 'Test info with a link to [OneArmy](https://www.onearmy.earth/).\n![test-img](https://wbskztclbriekwpehznv.supabase.co/storage/v1/object/public/precious-plastic/pp-logo.png)',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Test info with a link to ' },
            {
              type: 'text',
              text: 'OneArmy',
              marks: [
                {
                  type: 'link',
                  attrs: { href: 'https://www.onearmy.earth/', target: '_blank' },
                },
              ],
            },
            { type: 'text', text: '.' },
          ],
        },
        {
          type: 'image',
          attrs: {
            src: 'https://wbskztclbriekwpehznv.supabase.co/storage/v1/object/public/precious-plastic/pp-logo.png',
            alt: 'test-img',
          },
        },
      ],
    },
    category: null,
    comment_count: 2,
    created_at: new Date(),
    deleted: false,
    // hero_image: {
    //   id: '30',
    //   path: '',
    //   fullPath: '',
    // },
    modified_at: null,
    previous_slugs: [],
    slug: 'the-first-test-news',
    summary: 'So first, the very first.',
    title: 'The First Test News',
    total_views: 3,
  },
  {
    body: 'This is a test mock for the filtering question.',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'This is a test mock for the filtering question.' }],
        },
      ],
    },
    category: null,
    comment_count: 2,
    created_at: new Date(),
    deleted: false,
    // hero_image: {
    //   id: '31',
    //   path: '',
    //   fullPath: '',
    // },
    modified_at: null,
    previous_slugs: [],
    summary: 'Filtering at its best.',
    slug: 'filtering-question',
    title: 'The Filtering Question',
    total_views: 12,
  },
  {
    body: "What's the deal with screenings?",
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: "What's the deal with screenings?" }],
        },
      ],
    },
    category: null,
    comment_count: 2,
    created_at: new Date(),
    deleted: false,
    // hero_image: {
    //   id: '32',
    //   path: '',
    //   fullPath: '',
    // },
    modified_at: null,
    previous_slugs: ['whats-the-deal-with-screenings'],
    slug: 'intro-screenings-update',
    summary: 'Important deal info.',
    title: 'Intro screenings Update',
    total_views: 4,
  },
];
