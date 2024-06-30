export declare const FRIENDLY_MESSAGES: {
    [x: string]: string;
    '': string;
    'auth/argument-error': string;
    'auth/email-already-in-use': string;
    'auth/invalid-email': string;
    'auth/user-not-found': string;
    'auth/wrong-password': string;
    'reset email sent': string;
    'profile saved': string;
    'sign-up/username-taken': string;
};
/**
 * Conversion for default error messages.
 * @param systemMessage - the message text for lookup in the table.
 * This can either be a status code or full message (depending on how saved above)
 */
export declare const getFriendlyMessage: (systemMessage?: string) => string;
