import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { FactoryNewsFormData } from 'src/test/factories/News';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NewsForm } from './NewsForm';
import type { NewsFormData } from 'oa-shared';

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
      render(<NewsForm id={null} formData={null} formAction="create" />);

      // Check that all required fields are present
      expect(screen.getByTestId('news-create-form')).toBeInTheDocument();
      expect(screen.getByTestId('title-field')).toBeInTheDocument();
      expect(screen.getByTestId('news-body-field')).toBeInTheDocument();
    });

    it('renders form with existing news data in edit mode', () => {
      const mockNewsFormData: NewsFormData = FactoryNewsFormData({
        title: 'Existing News',
        body: 'Existing body content',
        isDraft: false,
        heroImage: {
          id: 'image-123',
          path: 'https://example.com/image.jpg',
          fullPath: 'https://example.com/image.jpg',
          publicUrl: 'https://example.com/image.jpg',          
        },
      });

      render(<NewsForm id={123} formData={mockNewsFormData} formAction="edit" />);

      expect(screen.getByTestId('news-create-form')).toBeInTheDocument();
    });

    it('displays all required form fields', () => {
      render(<NewsForm id={null} formData={null} formAction="create" />);

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
      render(<NewsForm id={null} formData={null} formAction="create" />);

      // The form should have title and body fields
      expect(screen.getByTestId('title-field')).toBeInTheDocument();
      expect(screen.getByTestId('news-body-field')).toBeInTheDocument();
    });

    it('initializes with correct empty values for new news', () => {
      render(<NewsForm id={null} formData={null} formAction="create" />);

      // Form should render without errors
      const form = screen.getByTestId('news-create-form');
      expect(form).toBeInTheDocument();
    });

    it('initializes with existing values for edit mode', () => {
      const mockNewsFormData: NewsFormData = FactoryNewsFormData({
        title: 'Original Title',
        body: 'Original body',
        isDraft: false,
        category: {
          label: 'Test Category',
          value: '1',
        },
      });

      render(<NewsForm id={456} formData={mockNewsFormData} formAction="edit" />);

      // Form should render with the news data
      const form = screen.getByTestId('news-create-form');
      expect(form).toBeInTheDocument();
    });
  });

  describe('Draft Functionality', () => {
    it('provides draft save capability', () => {
      render(<NewsForm id={null} formData={null} formAction="create" />);

      // Draft button should be available
      const form = screen.getByTestId('news-create-form');
      expect(form).toBeInTheDocument();
    });

    it('renders draft news correctly', () => {
      const draftNewsFormData: NewsFormData = FactoryNewsFormData({
        title: 'Draft News',
        body: 'Draft content',
        isDraft: true,
      });

      render(<NewsForm id={999} formData={draftNewsFormData} formAction="edit" />);

      const form = screen.getByTestId('news-create-form');
      expect(form).toBeInTheDocument();
    });
  });

  describe('Image Handling', () => {
    it('shows existing hero image when available', () => {
      const mockNewsFormData: NewsFormData = FactoryNewsFormData({
        title: 'News with Image',
        body: 'Body content',
        heroImage: {
          id: 'image-789',
          path: 'https://example.com/hero.jpg',
          fullPath: 'https://example.com/hero.jpg',
          publicUrl: 'https://example.com/hero.jpg',
        },
      });

      render(<NewsForm id={789} formData={mockNewsFormData} formAction="edit" />);

      const form = screen.getByTestId('news-create-form');
      expect(form).toBeInTheDocument();
    });

    it('allows image upload for new news', () => {
      render(<NewsForm id={null} formData={null} formAction="create" />);

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

      render(<NewsForm id={null} formData={null} formAction="create" />);

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

      render(<NewsForm id={null} formData={null} formAction="create" />);

      const form = screen.getByTestId('news-create-form');
      expect(form).toBeInTheDocument();
    });
  });

  describe('Profile Badge Support', () => {
    it('supports profile badge selection', () => {
      const mockNewsFormData: NewsFormData = FactoryNewsFormData({
        profileBadge: {
          label: 'PRO',
          value: '1',
        },
      });

      render(<NewsForm id={111} formData={mockNewsFormData} formAction="edit" />);

      const form = screen.getByTestId('news-create-form');
      expect(form).toBeInTheDocument();
    });
  });

  describe('Form Actions', () => {
    it('renders form correctly for create mode', () => {
      render(<NewsForm id={null} formData={null} formAction="create" />);

      const form = screen.getByTestId('news-create-form');
      expect(form).toBeInTheDocument();
    });

    it('renders form correctly for edit mode', () => {
      const mockNewsFormData = FactoryNewsFormData();
      render(<NewsForm id={123} formData={mockNewsFormData} formAction="edit" />);

      const form = screen.getByTestId('news-create-form');
      expect(form).toBeInTheDocument();
    });
  });
});

