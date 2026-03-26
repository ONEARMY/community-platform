export type UserEmailData = {
  email: string;
  code: string;
  new_email?: string;
  user_metadata?: {
    username?: string;
  };
};
