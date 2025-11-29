import logo from "../../assets/images/precious-plastic-logo-official.svg";
import { baseTheme } from "../common";
import { getButtons } from "../common/button";

import type { ThemeWithName } from "../types";

export type { ButtonVariants } from "../common/button";

// use enum to specify list of possible colors for typing
export const colors = {
  ...baseTheme.colors,
  primary: "#fee77b",
  accent: { base: "#fee77b", hover: "#ffde45" },
};

export const alerts = {
  ...baseTheme.alerts,
  accent: {
    ...baseTheme.alerts.failure,
    backgroundColor: colors.accent.base,
    color: colors.black,
  },
};

export const styles: ThemeWithName = {
  name: "Precious Plastic",
  logo: logo,
  ...baseTheme,
  alerts,
  buttons: getButtons(colors),
  colors,
};
