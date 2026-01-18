import { transformNotification } from 'src/routes/api.notifications';
import { notificationEmailService } from 'src/services/notificationEmailService.server';
import { TenantSettingsService } from 'src/services/tenantSettingsService.server';
import { tokens } from 'src/utils/tokens.server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { factoryDBNotification } from '../factories/dbNotification';
import { createMockSupabaseClient } from '../utils/supabaseClientMock';

import type { Mock } from 'vitest';

vi.mock('src/routes/api.notifications');
vi.mock('src/utils/tokens.server');
vi.mock('src/services/tenantSettingsService.server');
vi.mock('src/.server/resend');

const mockTransformNotification = transformNotification as Mock;
const mockTokensGenerate = tokens.generate as Mock;

describe('notificationEmailService', () => {
  const headers = new Headers();

  beforeEach(() => {
    vi.clearAllMocks();
    console.error = vi.fn();
    
    // Mock TenantSettingsService
    vi.mocked(TenantSettingsService).prototype.get = vi.fn().mockResolvedValue({
      emailFrom: 'noreply@example.com',
    });
  });

  describe('sendInstantNotificationEmails', () => {
    it('should handle error when RPC returns error', async () => {
      const { client, mocks } = createMockSupabaseClient();
      const notification = factoryDBNotification();
      const contentId = 456;

      mocks.rpc.mockResolvedValue({
        error: new Error('Database error'),
        data: [],
      });

      await notificationEmailService.sendInstantNotificationEmails(
        client,
        contentId,
        notification,
        headers,
      );

      expect(console.error).toHaveBeenCalledWith(
        'Error creating email notification:',
        expect.any(Error),
      );
      expect(mocks.rpc).toHaveBeenCalledWith('get_subscribed_users_emails_to_notify', {
        p_content_id: contentId,
        p_content_type: 'comments',
        p_notification_content_type: notification.source_content_type,
      });
    });

    it('should handle when no emails are returned', async () => {
      const { client, mocks } = createMockSupabaseClient();
      const notification = factoryDBNotification();
      const contentId = 456;

      mocks.rpc.mockResolvedValue({
        data: [],
        error: null,
      });

      await notificationEmailService.sendInstantNotificationEmails(
        client,
        contentId,
        notification,
        headers,
      );

      expect(console.error).toHaveBeenCalledWith(
        'Error creating email notification:',
        expect.any(Error),
      );
    });

    it('should filter out the user who triggered the notification', async () => {
      const { client, mocks } = createMockSupabaseClient();
      const notification = factoryDBNotification({ triggered_by_id: 123 });
      const contentId = 456;

      mocks.rpc.mockResolvedValue({
        data: [
          { profile_id: 123, email: 'triggerer@example.com', profile_created_at: '2024-01-01' },
        ],
        error: null,
      });

      await notificationEmailService.sendInstantNotificationEmails(
        client,
        contentId,
        notification,
        headers,
      );

      expect(console.error).toHaveBeenCalledWith(
        'Error creating email notification:',
        expect.any(Error),
      );
    });

    it('should send emails when subscribers are found', async () => {
      const { client, mocks } = createMockSupabaseClient();
      const notification = factoryDBNotification({ triggered_by_id: 123 });
      const contentId = 456;
      const generatedToken = 'test-token';
      const transformedNotification = { ...notification, transformed: true };
      const { sendBatchEmails } = await import('src/.server/resend');

      mocks.rpc.mockResolvedValue({
        data: [
          { profile_id: 789, email: 'user1@example.com', profile_created_at: '2024-01-01' },
          { profile_id: 999, email: 'user2@example.com', profile_created_at: '2024-01-02' },
        ],
        error: null,
      });

      mockTransformNotification.mockResolvedValue(transformedNotification);
      mockTokensGenerate.mockReturnValue(generatedToken);

      await notificationEmailService.sendInstantNotificationEmails(
        client,
        contentId,
        notification,
        headers,
      );

      expect(mocks.rpc).toHaveBeenCalledWith('get_subscribed_users_emails_to_notify', {
        p_content_id: contentId,
        p_content_type: 'comments',
        p_notification_content_type: notification.source_content_type,
      });
      expect(mockTransformNotification).toHaveBeenCalledWith(notification, client);
      expect(mockTokensGenerate).toHaveBeenCalledTimes(2);
      expect(sendBatchEmails).toHaveBeenCalled();
    });
  });
});
