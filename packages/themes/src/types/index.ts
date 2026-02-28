export interface PlatformTheme {
  text: any;
  colors: {
    primary: { base: string; hover: string };
    accent: { base: string; hover: string };
    white: string;
    black: string;
    softyellow: string;
    blue: string;
    red: string;
    red2: string;
    softblue: string;
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
  };

  fontSizes: number[];

  space: number[];
  radii: number[];

  zIndex: {
    behind: number;
    level: number;
    default: number;
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
