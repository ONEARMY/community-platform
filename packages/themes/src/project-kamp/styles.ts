import logo from "../../assets/images/themes/project-kamp/project-kamp-header.png";
import { baseTheme } from "../common";
import { getButtons } from "../common/button";

import type { ThemeWithName } from "../types";

export type { ButtonVariants } from "../common/button";

// use enum to specify list of possible colors for typing
export const colors = {
  ...baseTheme.colors,
  primary: "#8ab57f",
  accent: { base: "#8ab57f", hover: "hsl(108, 25%, 68%)" },
};

export const alerts = {
  ...baseTheme.alerts,
  accent: {
    ...baseTheme.alerts.failure,
    backgroundColor: colors.accent.base,
  },
};

export const StyledComponentTheme: ThemeWithName = {
  name: "Project Kamp",
  logo: logo,
  ...baseTheme,
  alerts,
  colors,
  buttons: getButtons(colors),
};
