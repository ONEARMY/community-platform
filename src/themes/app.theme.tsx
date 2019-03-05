import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import { blue, green, red } from "@material-ui/core/colors";

// A theme with custom primary and secondary color.
// see more examples here: https://medium.freecodecamp.org/meet-your-material-ui-your-new-favorite-user-interface-library-6349a1c88a8c
// and here: https://material-ui.com/customization/themes/

export const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
    fontFamily: 'Karla-Regular'
  },
  palette: {
    primary: {
      light: blue[300],
      main: blue[500],
      dark: blue[700]
    },
    secondary: {
      light: green[300],
      main: green[500],
      dark: green[700]
    },
    error: {
      light: red[300],
      main: red[500],
      dark: red[700]
    }
  }
});
