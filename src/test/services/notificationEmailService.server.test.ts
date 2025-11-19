import { transformNotification } from 'src/routes/api.notifications';
import { notificationEmailService } from 'src/services/notificationEmailService.server';
import { notificationsPreferencesServiceServer } from 'src/services/notificationsPreferencesService.server';
import { tokens } from 'src/utils/tokens.server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { factoryDBNotification } from '../factories/dbNotification';
import { createMockSupabaseClient } from '../utils/supabaseClientMock';

import type { Mock } from 'vitest';

vi.mock('src/routes/api.notifications');
vi.mock('src/utils/tokens.server');
vi.mock('src/services/notificationsPreferencesService.server');

const mockTransformNotification = transformNotification as Mock;
const mockTokensGenerate = tokens.generate as Mock;
const mockGetPreferences = notificationsPreferencesServiceServer.getPreferences as Mock;

describe('notificationEmailService', () => {
  const headers = new Headers();

  beforeEach(() => {
    vi.clearAllMocks();
    console.error = vi.fn();
  });

  describe('createInstantNotificationEmail', () => {
    it('should return early when profile data is not found', async () => {
      const { client, mocks } = createMockSupabaseClient();
      const notification = factoryDBNotification();

      mocks.single.mockResolvedValue({
        data: null,
      });

      const result = await notificationEmailService.createInstantNotificationEmail(
        client,
        notification,
        123,
        headers,
      );

      expect(result).toBeUndefined();
      expect(console.error).toHaveBeenCalledWith('Profile not found for ID:', 123);
      expect(mocks.rpc).not.toHaveBeenCalled();
      expect(mocks.functionsInvoke).not.toHaveBeenCalled();
    });

    it('should error when RPC response has no data', async () => {
      const { client, mocks } = createMockSupabaseClient();
      const notification = factoryDBNotification();
      const profileId = 123;

      mocks.single.mockResolvedValue({
        data: { created_at: '2024-01-01', roles: ['beta-tester'] },
      });

      mockGetPreferences.mockResolvedValue({
        is_unsubscribed: false,
        comments: true,
      });

      mocks.rpc.mockResolvedValue({
        data: null,
      });

      await notificationEmailService.createInstantNotificationEmail(
        client,
        notification,
        profileId,
        headers,
      );

      expect(console.error).toHaveBeenCalledWith(`No email found for profile ID: ${profileId}`);
      expect(mocks.functionsInvoke).not.toHaveBeenCalled();
    });

    it('should return early when user email is missing', async () => {
      const { client, mocks } = createMockSupabaseClient();
      const notification = factoryDBNotification();
      const profileId = 123;

      mocks.single.mockResolvedValue({
        data: { created_at: '2024-01-01', roles: ['beta-tester'] },
      });

      mockGetPreferences.mockResolvedValue({
        is_unsubscribed: false,
        comments: true,
      });

      mocks.rpc.mockResolvedValue({
        data: [{ email: null }],
      });

      const result = await notificationEmailService.createInstantNotificationEmail(
        client,
        notification,
        profileId,
        headers,
      );

      expect(result).toBeUndefined();
      expect(console.error).toHaveBeenCalledWith('Email is missing for profile ID:', profileId);
      expect(mocks.functionsInvoke).not.toHaveBeenCalled();
    });

    it('should send email when all conditions are met', async () => {
      const { client, mocks } = createMockSupabaseClient();
      const notification = factoryDBNotification();
      const profileId = 123;
      const userEmail = 'test@example.com';
      const generatedToken = 'test-token';
      const transformedNotification = { ...notification, transformed: true };

      mocks.single.mockResolvedValue({
        data: { created_at: '2024-01-01', roles: ['beta-tester'] },
      });

      mockGetPreferences.mockResolvedValue({
        is_unsubscribed: false,
        comments: true,
      });

      mocks.rpc.mockResolvedValue({
        data: [{ email: userEmail }],
      });

      mockTransformNotification.mockResolvedValue(transformedNotification);
      mockTokensGenerate.mockReturnValue(generatedToken);

      await notificationEmailService.createInstantNotificationEmail(
        client,
        notification,
        profileId,
        headers,
      );

      expect(mocks.from).toHaveBeenCalledWith('profiles');
      expect(mocks.rpc).toHaveBeenCalledWith('get_user_email_by_profile_id', {
        id: profileId,
      });
      expect(mockTransformNotification).toHaveBeenCalledWith(notification, client);
      expect(mockTokensGenerate).toHaveBeenCalledWith(profileId, '2024-01-01');
      expect(mocks.functionsInvoke).toHaveBeenCalledWith('send-email', {
        body: {
          user: {
            code: generatedToken,
            email: userEmail,
          },
          email_data: {
            email_action_type: 'instant_notification',
            notification: transformedNotification,
          },
        },
      });
    });
  });
});
