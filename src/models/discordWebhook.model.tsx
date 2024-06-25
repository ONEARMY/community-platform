// Base embed footer interface
export interface IDiscordEmbedFooter {
  text: string
  icon_url?: string
  proxy_icon_url?: string
}

// Base embed image interface
export interface IDiscordEmbedImage {
  url?: string
  proxy_url?: string
  height?: number
  width?: number
}

// Base embed thumbnail interface
export interface IDiscordEmbedThumbnail {
  url?: string
  proxy_url?: string
  height?: number
  width?: number
}

// Base embed video interface
export interface IDiscordEmbedVideo {
  url?: string
  height?: number
  width?: number
}

// Base embed provider interface
export interface IDiscordEmbedProvider {
  name?: string
  url?: string
}

// Base embed author interface
export interface IDiscordEmbedAuthor {
  name?: string
  url?: string
  icon_url?: string
  proxy_icon_url?: string
}

// Base embed field interface
export interface IDiscordEmbedField {
  name: string
  value: string
  inline?: boolean
}

// Embed object interface
export interface IDiscordEmbed {
  title?: string
  type?: string // Always 'rich' for webhook embeds
  description?: string
  url?: string
  timestamp?: string
  color?: number
  footer?: IDiscordEmbedFooter
  image?: IDiscordEmbedImage
  thumbnail?: IDiscordEmbedThumbnail
  video?: IDiscordEmbedVideo
  provider?: IDiscordEmbedProvider
  author?: IDiscordEmbedAuthor
  fields?: IDiscordEmbedField[]
}

// Allowed mentions interface
export interface IDiscordAllowedMentions {
  parse?: ('roles' | 'users' | 'everyone')[]
  roles?: string[]
  users?: string[]
  replied_user?: boolean
}

// Component interface for message components like buttons or dropdowns
export interface IDiscordComponent {
  type: number
  custom_id?: string
  disabled?: boolean
  style?: number
  label?: string
  emoji?: {
    id?: string
    name?: string
    animated?: boolean
  }
  url?: string
  options?: {
    label: string
    value: string
    description?: string
    emoji?: {
      id?: string
      name?: string
      animated?: boolean
    }
    default?: boolean
  }[]
  placeholder?: string
  min_values?: number
  max_values?: number
  components?: IDiscordComponent[]
}

// File interface for sending files with the webhook
export interface IDiscordFile {
  attachment: string | Buffer // URL or Buffer
  name?: string
  description?: string
}

// Attachment interface for message attachments
export interface IDiscordAttachment {
  id: string
  filename: string
  size: number
  url: string
  proxy_url: string
  height?: number
  width?: number
  content_type?: string
  ephemeral?: boolean
}

// Applied tags interface for tagging messages
export interface IDiscordAppliedTag {
  id: string
  name: string
  moderated?: boolean
}

// Poll interface for creating polls
export interface IDiscordPollOption {
  label: string
  value: string
}

export interface IDiscordPoll {
  title: string
  options: IDiscordPollOption[]
  duration: number // in seconds
}

// Main webhook payload interface with additional fields
export interface IDiscordWebhookPayload {
  /**
   * The message contents (up to 2000 characters).
   */
  content?: string
  /**
   * Override the default username of the webhook.
   */
  username?: string
  /**
   * Override the default avatar of the webhook.
   */
  avatar_url?: string
  /**
   * True if this is a Text-to-Speech message.
   */
  tts?: boolean
  /**
   * Embedded rich content.
   */
  embeds?: IDiscordEmbed[]
  /**
   * Allowed mentions for the message.
   */
  allowed_mentions?: IDiscordAllowedMentions
  /**
   * Message flags, used primarily for suppressing embeds.
   */
  flags?: number
  /**
   * Name of the thread to create (requires the webhook to be in a thread-enabled channel).
   */
  thread_name?: string
  /**
   * Components to include with the message (such as buttons or dropdowns).
   */
  components?: IDiscordComponent[]
  /**
   * Files to include with the message.
   */
  files?: IDiscordFile[]
  /**
   * JSON payload to include with the message.
   */
  payload_json?: string
  /**
   * Attachments to include with the message.
   */
  attachments?: IDiscordAttachment[]
  /**
   * Tags to apply to the message.
   */
  applied_tags?: IDiscordAppliedTag[]
  /**
   * Poll to include with the message.
   */
  poll?: IDiscordPoll
}
