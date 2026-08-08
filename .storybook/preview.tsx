import type { Preview } from '@storybook/react-vite';
import { useEffect } from 'react';
import '../src/styles/ui-globals.css';

// Mirrors packages/components/.storybook/preview.tsx's tenant switcher so both
// component libraries can be previewed under the same set of tenant brand colors.
export const themeColors = {
  'precious-plastic': {
    primary: '#fee77b',
    primaryHover: '#ffde45',
    accent: '#fee77b',
    accentHover: '#ffde45',
  },
  'project-kamp': {
    primary: '#8ab57f',
    primaryHover: 'hsl(108, 25%, 68%)',
    accent: '#8ab57f',
    accentHover: 'hsl(108, 25%, 68%)',
  },
  'fixing-fashion': {
    primary: '#f82f03',
    primaryHover: 'hsl(14, 81%, 63%)',
    accent: '#f82f03',
    accentHover: 'hsl(14, 81%, 63%)',
  },
} as const;

export type ThemeName = keyof typeof themeColors;

export function getThemeCSSVariables(themeName: ThemeName): string {
  const colors = themeColors[themeName];
  return `
    --color-primary: ${colors.primary};
    --color-primary-hover: ${colors.primaryHover};
    --color-accent: ${colors.accent};
    --color-accent-hover: ${colors.accentHover};
  `.trim();
}

const themeMap: Record<string, ThemeName> = {
  pp: 'precious-plastic',
  pk: 'project-kamp',
  ff: 'fixing-fashion',
};

function ThemeVariables({ themeName }: { themeName: ThemeName }) {
  useEffect(() => {
    const cssVars = getThemeCSSVariables(themeName);
    const styleId = 'theme-variables';

    let styleTag = document.getElementById(styleId) as HTMLStyleElement;
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }

    styleTag.textContent = `:root { ${cssVars} }`;
  }, [themeName]);

  return null;
}

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Platform Theme',
      defaultValue: 'pp',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'pp', title: 'Precious Plastic' },
          { value: 'pk', title: 'Project Kamp' },
          { value: 'ff', title: 'Fixing Fashion' },
        ],
      },
    },
  },
  decorators: [
    (Story, context) => {
      const themeName = themeMap[context.globals.theme] || 'precious-plastic';

      return (
        <>
          <ThemeVariables themeName={themeName} />
          <Story />
        </>
      );
    },
  ],
};

export default preview;
