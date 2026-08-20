import { defineConfig } from 'vite';

// Intentionally empty: this exists only so @storybook/builder-vite loads it
// instead of auto-discovering the app's root vite.config.ts (which includes
// the React Router SSR plugin - incompatible outside the real app). See
// .storybook/main.ts's viteFinal for the plugins this Storybook instance uses.
export default defineConfig({});
