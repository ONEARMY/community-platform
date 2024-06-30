export declare enum EmailNotificationFrequency {
    NEVER = "never",
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly"
}
export declare const NotificationTypes: readonly ["new_comment", "howto_useful", "howto_mention", "howto_approved", "howto_needs_updates", "map_pin_approved", "map_pin_needs_updates", "new_comment_discussion", "new_comment_research", "research_useful", "research_mention", "research_update", "research_approved", "research_needs_updates"];
export type NotificationType = (typeof NotificationTypes)[number];
export type UserNotificationItem = {
    type: NotificationType;
    children: React.ReactNode;
};
