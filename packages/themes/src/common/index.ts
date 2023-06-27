class AuxiliaryStyle {
  static _commonInputStyle = {
    borderRadius: 1,
    '&:focus': {
      borderColor: '#83ceeb',
      outline: 'none',
      boxShadow: 'none',
    },
  }

  static _colors = {
    white: 'white',
    offwhite: '#ececec',
    black: '#1b1b1b',
    softyellow: '#f5ede2',
    blue: '#83ceeb',
    red: '#eb1b1f',
    red2: '#f58d8e',
    softblue: '#e2edf7',
    bluetag: '#5683b0',
    grey: '#61646b',
    green: '#00c3a9',
    error: 'red',
    background: '#f4f6f7',
    silver: '#c0c0c0',
    softgrey: '#c2d4e4',
    lightgrey: '#ababac',
    darkGrey: '#686868',
    subscribed: 'orange',
    notSubscribed: '#1b1b1b',
    betaGreen: '#98cc98',
  }

  static _commonAlertsStyle = {
    borderRadius: 1,
    paddingX: 3,
    paddingY: 3,
    textAlign: 'center',
    fontWeight: 'normal',
  }

  static _commonFontFamily = {
    body: `'Inter', Arial, sans-serif`,
  }
  static _commonSpace = [
    0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90,
    95, 100, 105, 110, 115, 120, 125, 130, 135, 140,
  ]
}

export const baseTheme = {
  colors: AuxiliaryStyle._colors,
  zIndex: {
    behind: -1,
    level: 0,
    default: 1,
    slickArrows: 100,
    modalProfile: 900,
    logoContainer: 999,
    mapFlexBar: 2000,
    header: 3000,
  },
  text: {
    heading: {
      fontFamily: '"Varela Round", Arial, sans-serif',
      fontSize: 5,
      fontWeight: 'normal',
    },
    small: {
      fontFamily: '"Varela Round", Arial, sans-serif',
      fontSize: 4,
      fontWeight: 'normal',
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
      color: AuxiliaryStyle._colors.grey,
    },
    paragraph: {
      fontFamily: '"Inter", Helvetica Neue, Arial, sans-serif;',
      fontSize: '16px',
      color: AuxiliaryStyle._colors.grey,
    },
  },
  space: AuxiliaryStyle._commonSpace,
  radii: AuxiliaryStyle._commonSpace,
  fonts: AuxiliaryStyle._commonFontFamily,

  forms: {
    input: {
      ...AuxiliaryStyle._commonInputStyle,
      background: AuxiliaryStyle._colors.background,
      border: '1px solid transparent',
      fontFamily: AuxiliaryStyle._commonFontFamily.body,
      fontSize: 1,
    },
    inputOutline: {
      ...AuxiliaryStyle._commonInputStyle,
      background: 'white',
      border: `2px solid ${AuxiliaryStyle._colors.black}`,
    },
    error: {
      ...AuxiliaryStyle._commonInputStyle,
      background: AuxiliaryStyle._colors.background,
      border: `1px solid ${AuxiliaryStyle._colors.error}`,
      fontFamily: AuxiliaryStyle._commonFontFamily.body,
      fontSize: 1,
    },
    textarea: {
      ...AuxiliaryStyle._commonInputStyle,
      background: AuxiliaryStyle._colors.background,
      border: `1px solid transparent`,
      fontFamily: AuxiliaryStyle._commonFontFamily.body,
      fontSize: 1,
      padding: 2,
    },
    textareaError: {
      ...AuxiliaryStyle._commonInputStyle,
      background: AuxiliaryStyle._colors.background,
      border: `1px solid ${AuxiliaryStyle._colors.error}`,
      fontFamily: AuxiliaryStyle._commonFontFamily.body,
      fontSize: 1,
      padding: 2,
    },
  },
  maxContainerWidth: 1280,
  sizes: {
    container: 1280,
  },
  regular: 400,
  bold: 600,
  fontSizes: [10, 12, 14, 18, 22, 30, 38, 42, 46, 50, 58, 66, 74],
  cards: {
    primary: {
      background: 'white',
      border: `2px solid ${AuxiliaryStyle._colors.black}`,
      borderRadius: 1,
      overflow: 'hidden',
    },
  },
  breakpoints: ['40em', '52em', '70em'], // standard widths: 512px, 768px, 1024px
  alerts: {
    success: {
      ...AuxiliaryStyle._commonAlertsStyle,
      backgroundColor: AuxiliaryStyle._colors.green,
    },
    failure: {
      ...AuxiliaryStyle._commonAlertsStyle,
      backgroundColor: AuxiliaryStyle._colors.red2,
    },
  },
}
