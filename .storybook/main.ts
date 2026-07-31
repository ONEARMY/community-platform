import type { StorybookConfig } from '@storybook/react-vite';
import { createRequire } from 'module';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { mergeConfig } from 'vite';

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ['../src/components/ui/**/*.stories.tsx'],

  addons: [getAbsolutePath('@storybook/addon-links'), getAbsolutePath('@storybook/addon-docs')],

  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {
      builder: {
        // This config dir's parent is the repo root, so @storybook/builder-vite's
        // own auto-discovery would otherwise load the app's root vite.config.ts
        // (React Router SSR plugin - incompatible outside the real app). Pointing
        // it at this empty file instead avoids that; our actual plugins are added
        // below via viteFinal.
        viteConfigPath: join(__dirname, 'vite.config.ts'),
      },
    },
  },

  async viteFinal(config) {
    const { default: tailwindcss } = await import('@tailwindcss/vite');
    const { default: svgr } = await import('vite-plugin-svgr');
    const { default: tsconfigPaths } = await import('vite-tsconfig-paths');

    return mergeConfig(config, {
      plugins: [tailwindcss(), svgr(), tsconfigPaths({ root: '../' })],
    });
  },
};
export default config;

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
}
