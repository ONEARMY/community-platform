import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserRole } from 'oa-shared';
import { FactoryUser } from 'src/test/factories/User';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BanUserButton } from './BanUserButton';

const mockUseProfileStore = vi.hoisted(() => vi.fn());
const mockUseToast = vi.hoisted(() => vi.fn());
const mockNavigate = vi.hoisted(() => vi.fn());

vi.mock('src/stores/Profile/profile.store', () => ({
  useProfileStore: mockUseProfileStore,
  ProfileStoreProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('src/common/Toast', () => ({
  useToast: mockUseToast,
}));

vi.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
}));

global.fetch = vi.fn();

describe('BanUserButton', () => {
  const mockToast = {
    promise: vi.fn(),
  };

  beforeEach(() => {
    vi.resetAllMocks();
    mockUseToast.mockReturnValue(mockToast);
    mockNavigate.mockClear();
    (global.fetch as any).mockClear();
  });

  it('should show disabled button with tooltip when viewing own profile', () => {
    const currentUser = FactoryUser({
      username: 'testuser',
      roles: [UserRole.ADMIN],
    });

    mockUseProfileStore.mockReturnValue({
      profile: currentUser,
      isUserAuthorized: vi.fn().mockReturnValue(true),
    });

    render(<BanUserButton profile={currentUser as any} />);
    const button = screen.getByTestId('BanUserButton');
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('should not render when user lacks permission', () => {
    const currentUser = FactoryUser({
      username: 'admin',
      roles: [], // No admin/moderator role
    });

    const targetUser = FactoryUser({
      username: 'targetuser',
      roles: [],
    });

    mockUseProfileStore.mockReturnValue({
      profile: currentUser,
      isUserAuthorized: vi.fn().mockReturnValue(false),
    });

    const { container } = render(<BanUserButton profile={targetUser as any} />);
    expect(container).toBeEmptyDOMElement();
  });

  it.each([
    { role: UserRole.ADMIN, roleName: 'ADMIN' },
    { role: UserRole.MODERATOR, roleName: 'MODERATOR' },
    { role: UserRole.EDITOR, roleName: 'EDITOR' },
  ])('should show disabled button with tooltip when target has $roleName role', ({ role }) => {
    const currentUser = FactoryUser({
      username: 'admin',
      roles: [UserRole.ADMIN],
    });

    const targetUser = FactoryUser({
      username: 'protecteduser',
      roles: [role],
    });

    mockUseProfileStore.mockReturnValue({
      profile: currentUser,
      isUserAuthorized: vi.fn().mockReturnValue(true),
    });

    render(<BanUserButton profile={targetUser as any} />);
    const button = screen.getByTestId('BanUserButton');
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('should render button when admin views regular user', () => {
    const currentUser = FactoryUser({
      username: 'admin',
      roles: [UserRole.ADMIN],
    });

    const targetUser = FactoryUser({
      id: 123,
      username: 'regularuser',
      roles: [],
    });

    mockUseProfileStore.mockReturnValue({
      profile: currentUser,
      isUserAuthorized: vi.fn().mockReturnValue(true),
    });

    render(<BanUserButton profile={targetUser as any} />);
    expect(screen.getByTestId('BanUserButton')).toBeInTheDocument();
  });

  it('should open modal when button is clicked', async () => {
    const user = userEvent.setup();
    const currentUser = FactoryUser({
      username: 'admin',
      roles: [UserRole.ADMIN],
    });

    const targetUser = FactoryUser({
      id: 123,
      username: 'regularuser',
      roles: [],
    });

    mockUseProfileStore.mockReturnValue({
      profile: currentUser,
      isUserAuthorized: vi.fn().mockReturnValue(true),
    });

    render(<BanUserButton profile={targetUser as any} />);
    
    const banButton = screen.getByTestId('BanUserButton');
    await user.click(banButton);

    await waitFor(() => {
      expect(screen.getByTestId('BanUserModal')).toBeInTheDocument();
      expect(screen.getByText(/Ban User - This action will:/)).toBeInTheDocument();
    });
  });

  it('should disable confirm button until checkbox is checked', async () => {
    const user = userEvent.setup();
    const currentUser = FactoryUser({
      username: 'admin',
      roles: [UserRole.ADMIN],
    });

    const targetUser = FactoryUser({
      id: 123,
      username: 'regularuser',
      roles: [],
    });

    mockUseProfileStore.mockReturnValue({
      profile: currentUser,
      isUserAuthorized: vi.fn().mockReturnValue(true),
    });

    render(<BanUserButton profile={targetUser as any} />);
    
    await user.click(screen.getByTestId('BanUserButton'));

    await waitFor(() => {
      const confirmButton = screen.getByTestId('BanUserModal: Confirm');
      expect(confirmButton).toBeDisabled();
    });

    const checkbox = screen.getByTestId('BanUserConfirmCheckbox');
    await user.click(checkbox);

    await waitFor(() => {
      const confirmButton = screen.getByTestId('BanUserModal: Confirm');
      expect(confirmButton).not.toBeDisabled();
    });
  });

  it('should call API and navigate on successful ban', async () => {
    const user = userEvent.setup();
    const currentUser = FactoryUser({
      username: 'admin',
      roles: [UserRole.ADMIN],
    });

    const targetUser = FactoryUser({
      id: 123,
      username: 'regularuser',
      roles: [],
    });

    mockUseProfileStore.mockReturnValue({
      profile: currentUser,
      isUserAuthorized: vi.fn().mockReturnValue(true),
    });

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<BanUserButton profile={targetUser as any} />);
    
    await user.click(screen.getByTestId('BanUserButton'));
    await user.click(screen.getByTestId('BanUserConfirmCheckbox'));
    await user.click(screen.getByTestId('BanUserModal: Confirm'));

    await waitFor(() => {
      expect(mockToast.promise).toHaveBeenCalled();
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/profile/123/ban',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }),
      );
    });
  });

  it('should close modal when cancel is clicked', async () => {
    const user = userEvent.setup();
    const currentUser = FactoryUser({
      username: 'admin',
      roles: [UserRole.ADMIN],
    });

    const targetUser = FactoryUser({
      id: 123,
      username: 'regularuser',
      roles: [],
    });

    mockUseProfileStore.mockReturnValue({
      profile: currentUser,
      isUserAuthorized: vi.fn().mockReturnValue(true),
    });

    render(<BanUserButton profile={targetUser as any} />);
    
    await user.click(screen.getByTestId('BanUserButton'));

    await waitFor(() => {
      expect(screen.getByTestId('BanUserModal')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('BanUserModal: Cancel'));

    await waitFor(() => {
      expect(screen.queryByTestId('BanUserModal')).not.toBeInTheDocument();
    });
  });
});
