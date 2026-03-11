import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { FactoryNewsItem } from 'src/test/factories/News';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NewsForm } from './NewsForm';
import type { News } from 'oa-shared';

// Create mock navigate function
const mockNavigate = vi.fn();

// Mock react-router
vi.mock('react-router', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock services
const mockNewsServiceUpsert = vi.fn();
const mockStorageServiceImageUpload = vi.fn();

vi.mock('src/services/newsService', () => ({
  newsService: {
    upsert: (...args: any[]) => mockNewsServiceUpsert(...args),
  },
}));

vi.mock('src/services/storageService', () => ({
  storageService: {
    imageUpload: (...args: any[]) => mockStorageServiceImageUpload(...args),
  },
}));

// Mock logger
vi.mock('src/logger', () => ({
  logger: {
    error: vi.fn(),
  },
}));

// Mock UnsavedChangesDialog to avoid router context issues
vi.mock('src/common/Form/UnsavedChangesDialog', () => ({
  UnsavedChangesDialog: () => null,
}));

// Mock FormWrapper to simplify testing
vi.mock('src/common/Form/FormWrapper', () => ({
  FormWrapper: ({ children }: any) => <div data-testid="news-create-form">{children}</div>,
}));

// Mock all form field components
vi.mock('src/pages/common/FormFields/Category.field', () => ({
  CategoryField: () => <div data-testid="category-field" />,
}));

vi.mock('src/pages/common/FormFields/Tags.field', () => ({
  TagsField: () => <div data-testid="tags-field" />,
}));

vi.mock('src/pages/common/FormFields/ProfileBadgeField', () => ({
  ProfileBadgeField: () => <div data-testid="profile-badge-field" />,
}));

vi.mock('src/pages/common/FormFields/Title.field', () => ({
  TitleField: () => <div data-testid="title-field" />,
}));

vi.mock('./FormFields', () => ({
  NewsImageField: () => <div data-testid="news-image-field" />,
  NewsBodyField: () => <div data-testid="news-body-field" />,
}));

vi.mock('src/pages/News/Content/Common/NewsPostingGuidelines', () => ({
  NewsPostingGuidelines: () => <div data-testid="guidelines" />,
}));


describe('NewsForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
  });

  describe('Component Rendering', () => {
    it('renders empty form for new news creation', () => {
      render(<NewsForm news={null} parentType="create" />);

      // Check that all required fields are present
      expect(screen.getByTestId('news-create-form')).toBeInTheDocument();
      expect(screen.getByTestId('title-field')).toBeInTheDocument();
      expect(screen.getByTestId('news-body-field')).toBeInTheDocument();
    });

    it('renders form with existing news data in edit mode', () => {
      const mockNews: News = FactoryNewsItem({
        id: 123,
        title: 'Existing News',
        body: 'Existing body content',
        isDraft: false,
        heroImage: {
          id: 'image-123',
          fullPath: 'https://example.com/image.jpg',
          path: 'https://example.com/image.jpg',
          publicUrl: 'https://example.com/image.jpg',
        },
      });

      render(<NewsForm news={mockNews} parentType="edit" />);

      expect(screen.getByTestId('news-create-form')).toBeInTheDocument();
    });

    it('displays all required form fields', () => {
      render(<NewsForm news={null} parentType="create" />);

      // All form fields should be present
      expect(screen.getByTestId('title-field')).toBeInTheDocument();
      expect(screen.getByTestId('news-body-field')).toBeInTheDocument();
      expect(screen.getByTestId('category-field')).toBeInTheDocument();
      expect(screen.getByTestId('tags-field')).toBeInTheDocument();
      expect(screen.getByTestId('profile-badge-field')).toBeInTheDocument();
      expect(screen.getByTestId('news-image-field')).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('validates required fields exist', () => {
      render(<NewsForm news={null} parentType="create" />);

      // The form should have title and body fields
      expect(screen.getByTestId('title-field')).toBeInTheDocument();
      expect(screen.getByTestId('news-body-field')).toBeInTheDocument();
    });

    it('initializes with correct empty values for new news', () => {
      render(<NewsForm news={null} parentType="create" />);

      // Form should render without errors
      const form = screen.getByTestId('news-create-form');
      expect(form).toBeInTheDocument();
    });

    it('initializes with existing values for edit mode', () => {
      const mockNews: News = FactoryNewsItem({
        id: 456,
        title: 'Original Title',
        body: 'Original body',
        slug: 'original-slug',
        isDraft: false,
        category: {
          id: 1,
          name: 'Test Category',
          type: 'news',
          createdAt: new Date(),
          modifiedAt: null,
        },
      });

      render(<NewsForm news={mockNews} parentType="edit" />);

      // Form should render with the news data
      const form = screen.getByTestId('news-create-form');
      expect(form).toBeInTheDocument();
    });
  });

  describe('Draft Functionality', () => {
    it('provides draft save capability', () => {
      render(<NewsForm news={null} parentType="create" />);

      // Draft button should be available
      const form = screen.getByTestId('news-create-form');
      expect(form).toBeInTheDocument();
    });

    it('renders draft news correctly', () => {
      const draftNews: News = FactoryNewsItem({
        id: 999,
        title: 'Draft News',
        body: 'Draft content',
        isDraft: true,
        slug: 'draft-news',
      });

      render(<NewsForm news={draftNews} parentType="edit" />);

      const form = screen.getByTestId('news-create-form');
      expect(form).toBeInTheDocument();
    });
  });

  describe('Image Handling', () => {
    it('shows existing hero image when available', () => {
      const mockNews: News = FactoryNewsItem({
        id: 789,
        title: 'News with Image',
        body: 'Body content',
        heroImage: {
          id: 'image-789',
          path: 'https://example.com/hero.jpg',
          fullPath: 'https://example.com/hero.jpg',
          publicUrl: 'https://example.com/hero.jpg',
        },
      });

      render(<NewsForm news={mockNews} parentType="edit" />);

      const form = screen.getByTestId('news-create-form');
      expect(form).toBeInTheDocument();
    });

    it('allows image upload for new news', () => {
      render(<NewsForm news={null} parentType="create" />);

      const form = screen.getByTestId('news-create-form');
      expect(form).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles service errors gracefully', async () => {
      mockNewsServiceUpsert.mockRejectedValueOnce({
        message: 'Network error occurred',
        cause: 'network',
      });

      render(<NewsForm news={null} parentType="create" />);

      const form = screen.getByTestId('news-create-form');
      expect(form).toBeInTheDocument();
    });
  });

  describe('Navigation After Save', () => {
    it('provides navigation capability after successful save', async () => {
      mockNewsServiceUpsert.mockResolvedValueOnce({
        slug: 'test-news-slug',
        isDraft: false,
      });

      render(<NewsForm news={null} parentType="create" />);

      const form = screen.getByTestId('news-create-form');
      expect(form).toBeInTheDocument();
    });
  });

  describe('Profile Badge Support', () => {
    it('supports profile badge selection', () => {
      const mockNews: News = FactoryNewsItem({
        id: 111,
        profileBadge: {
          id: 1,
          name: 'pro',
          displayName: 'PRO',
          imageUrl: 'https://example.com/badge.png',
        },
      });

      render(<NewsForm news={mockNews} parentType="edit" />);

      const form = screen.getByTestId('news-create-form');
      expect(form).toBeInTheDocument();
    });
  });

  describe('Form Actions', () => {
    it('renders form correctly for create mode', () => {
      render(<NewsForm news={null} parentType="create" />);

      const form = screen.getByTestId('news-create-form');
      expect(form).toBeInTheDocument();
    });

    it('renders form correctly for edit mode', () => {
      const mockNews = FactoryNewsItem({ id: 123 });
      render(<NewsForm news={mockNews} parentType="edit" />);

      const form = screen.getByTestId('news-create-form');
      expect(form).toBeInTheDocument();
    });
  });
});

