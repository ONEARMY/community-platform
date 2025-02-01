const postWebhookRequest = async (message: string) => {
  try {
    const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL as string

    if (!discordWebhookUrl) {
      return
    }

    await fetch(discordWebhookUrl as string, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: message,
      }),
    })
  } catch (error) {
    console.error(error)
  }
}

export const discordServiceServer = {
  postWebhookRequest,
}
