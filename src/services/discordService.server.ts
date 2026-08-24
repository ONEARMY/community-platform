import { logger } from 'src/logger';

const postWebhookRequest = async (message: string, webhookUrl?: string) => {
  try {
    const discordWebhookUrl = webhookUrl ?? (process.env.DISCORD_WEBHOOK_URL as string);

    if (!discordWebhookUrl) {
      return;
    }

    await fetch(discordWebhookUrl as string, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: message,
        allowed_mentions: { parse: [] },
      }),
    });
  } catch (error) {
    logger.error(error);
  }
};

export const discordServiceServer = {
  postWebhookRequest,
};
