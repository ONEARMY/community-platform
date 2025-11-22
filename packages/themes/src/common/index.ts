import { commonStyles } from './commonStyles';

export const baseTheme = {
  colors: commonStyles.colors,
  zIndex: {
    behind: -1,
    level: 0,
    default: 1,
    modalProfile: 900,
    logoContainer: 999,
    header: 3000,
  },
  text: {
    heading: {
      fontFamily: '"Varela Round", Arial, sans-serif',
      fontSize: 6,
      fontWeight: 'normal',
    },
    small: {
      fontFamily: '"Varela Round", Arial, sans-serif',
      fontSize: 4,
      fontWeight: 'normal',
    },
    subHeading: {
      fontFamily: '"Varela Round", Arial, sans-serif',
      fontSize: 3,
      fontWeight: 'bold',
    },
    body: {
      fontFamily: `'Inter', Arial, sans-serif`,
    },
    quiet: {
      fontFamily: `'Inter', Arial, sans-serif`,
      color: 'grey',
    },
    auxiliary: {
      fontFamily: '"Inter", Helvetica Neue, Arial, sans-serif;',
      fontSize: 1,
      color: commonStyles.colors.grey,
    },
    paragraph: {
      fontFamily: '"Inter", Helvetica Neue, Arial, sans-serif;',
      fontSize: '16px',
      color: commonStyles.colors.grey,
    },
  },
  space: commonStyles.space,
  radii: commonStyles.space,
  fonts: commonStyles.fontFamily,

  forms: {
    input: {
      ...commonStyles.input,
      background: commonStyles.colors.background,
      border: '1px solid transparent',
      fontFamily: commonStyles.fontFamily.body,
      fontSize: 1,
    },
    inputOutline: {
      ...commonStyles.input,
      background: 'white',
      border: `2px solid ${commonStyles.colors.black}`,
    },
    error: {
      ...commonStyles.input,
      background: commonStyles.colors.background,
      border: `1px solid ${commonStyles.colors.error}`,
      fontFamily: commonStyles.fontFamily.body,
      fontSize: 1,
    },
    textarea: {
      ...commonStyles.input,
      background: commonStyles.colors.background,
      border: `2px solid transparent`,
      fontFamily: commonStyles.fontFamily.title,
      fontSize: 1,
      padding: 2,
    },
    textareaError: {
      ...commonStyles.input,
      background: commonStyles.colors.background,
      border: `2px solid ${commonStyles.colors.error}`,
      fontFamily: commonStyles.fontFamily.title,
      fontSize: 1,
      padding: 2,
    },
    select: {
      ...commonStyles.input,
      border: `2px solid ${commonStyles.colors.black}`,
      padding: 3,
    },
  },
  maxContainerWidth: 1280,
  sizes: {
    container: 1280,
  },
  regular: 400,
  bold: 600,
  fontSizes: [10, 12, 14, 16, 18, 22, 30, 38, 42, 46, 50, 58, 66, 74],
  cards: {
    primary: {
      background: 'white',
      border: `2px solid ${commonStyles.colors.black}`,
      borderRadius: 1,
      overflow: 'hidden',
    },
    responsive: {
      background: 'white',
      border: ['none', `2px solid ${commonStyles.colors.black}`],
      borderTop: `2px solid ${commonStyles.colors.black}`,
      borderBottom: `2px solid ${commonStyles.colors.black}`,
      borderRadius: [0, 2],
      overflow: 'hidden',
    },
    borderless: {
      background: 'white',
      border: 'none',
      borderRadius: 2,
      overflow: 'hidden',
    },
  },
  breakpoints: ['40em', '52em', '70em'], // standard widths: 512px, 768px, 1024px
  alerts: {
    success: {
      ...commonStyles.alert,
      backgroundColor: commonStyles.colors.green,
    },
    failure: {
      ...commonStyles.alert,
      backgroundColor: commonStyles.colors.red2,
    },
    info: {
      ...commonStyles.alert,
      backgroundColor: commonStyles.colors.softblue,
      color: commonStyles.colors.black,
    },
    warning: {
      ...commonStyles.alert,
      backgroundColor: commonStyles.colors.activeYellow,
      color: commonStyles.colors.black,
    },
  },
};
