import { MESSAGE_MAX_CHARACTERS } from './constants';

export const contact = {
  button: 'Contact',
  email: {
    title: 'Email (currently fixed to your email on record)',
    placeholder: 'hey@jack.com',
  },
  title: 'Send a message to',
  message: {
    title: `Message (max ${MESSAGE_MAX_CHARACTERS} characters)`,
    placeholder: 'What do you want to say?',
  },
  name: {
    title: 'Name',
    placeholder: "What's your name?",
  },
  successMessage: 'All sent',
};
