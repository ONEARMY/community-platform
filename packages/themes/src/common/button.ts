import { commonStyles } from './commonStyles';

const BASE_BUTTON = {
  fontFamily: '"Varela Round", Arial, sans-serif',
  fontSize: 3,
  display: 'inline-flex',
  cursor: 'pointer',
  alignItems: 'center',
  position: 'relative',
  transition: '.2s ease-in-out',
  borderRadius: 1,
  width: 'auto',
  border: '2px solid',
  height: '2.75rem',
};

const { black, white, softblue, red2, betaGreen, blue, grey, background, lightgrey } =
  commonStyles.colors;

export const buttons = {
  primary: {
    ...BASE_BUTTON,
    color: black,
    backgroundColor: 'var(--color-primary)',
    '&:hover': {
      backgroundColor: 'var(--color-primary-hover)',
    },
    '&[disabled]': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
    '&[disabled]:hover': {
      backgroundColor: 'var(--color-primary)',
    },
  },
  disabled: {
    ...BASE_BUTTON,
    color: black,
    backgroundColor: 'var(--color-primary)',
    opacity: 0.5,
    '&:hover': {
      backgroundColor: 'var(--color-primary-hover)',
    },
  },
  secondary: {
    ...BASE_BUTTON,
    border: '2px solid ' + black,
    color: black,
    backgroundColor: softblue,
    '&:hover': {
      backgroundColor: white,
      cursor: 'pointer',
    },
    '&[disabled]': {
      opacity: 0.5,
    },
    '&[disabled]:hover': {
      backgroundColor: softblue,
    },
  },
  destructive: {
    ...BASE_BUTTON,
    border: '2px solid ' + black,
    backgroundColor: red2,
    color: black,
    '&:hover': {
      backgroundColor: white,
    },
  },
  success: {
    ...BASE_BUTTON,
    border: '2px solid ' + black,
    backgroundColor: betaGreen,
    color: black,
    '&:hover': {
      filter: 'brightness(90%)',
    },
  },
  info: {
    ...BASE_BUTTON,
    border: '2px solid ' + black,
    backgroundColor: blue,
    color: black,
    '&:hover': {
      filter: 'brightness(90%)',
    },
  },
  outline: {
    ...BASE_BUTTON,
    border: '2px solid ' + black,
    color: black,
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: softblue,
    },
  },
  quiet: {
    ...BASE_BUTTON,
    border: '2px dashed ' + grey,
    color: grey,
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: background,
    },
    fontSize: 1,
  },
  imageInput: {
    border: '2px dashed #e0e0e0',
    color: '#e0e0e0',
    backgroundColor: 'transparent',
  },
  subtle: {
    ...BASE_BUTTON,
    borderWidth: 0,
    color: black,
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: softblue,
    },
    '&[disabled]': {
      opacity: 0.5,
    },
    '&[disabled]:hover': {
      backgroundColor: softblue,
    },
  },
  breadcrumb: {
    ...BASE_BUTTON,
    padding: '1',
    border: '1px solid transparent',
    backgroundColor: 'transparent',
    height: 'auto',
    color: 'dimgray',
    fontSize: 15,
    '&:hover': {
      backgroundColor: softblue,
      border: '1px solid ' + lightgrey,
    },
  },
};

export type ButtonVariants = 'primary' | 'secondary' | 'outline' | 'disabled' | 'subtle';
