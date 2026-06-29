export interface PlatformTheme {
  text: any;
  colors: {
    primary: string;
    primaryHover: string;
    accent: string;
    accentHover: string;
    white: string;
    black: string;
    softyellow: string;
    blue: string;
    red: string;
    red2: string;
    softblue: string;
    highlight: string;
    highlightHover: string;
    bluetag: string;
    grey: string;
    green: string;
    error: string;
    background: string;
    silver: string;
    softgrey: string;
    offWhite: string;
    lightgrey: string;
    darkGrey: string;
    subscribed: string;
    notSubscribed: string;
    betaGreen: string;
    popoverBorder: string;
  };

  fonts: {
    title: string;
    body: string;
    nav: string;
  };

  fontSizes: number[];

  space: number[];
  radii: number[];

  shadows: {
    popover: string;
    bottomNav: string;
  };

  images: {
    avatar: {
      flexShrink: number;
    };
  };

  zIndex: {
    behind: number;
    level: number;
    default: number;
    navDropdown: number;
    modalProfile: number;
    logoContainer: number;
    header: number;
  };
  breakpoints: string[];
  buttons: any;
  maxContainerWidth: number;
  regular: number;
  bold: number;

  sizes: {
    container: number;
  };
}
