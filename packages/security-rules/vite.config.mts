import { defineConfig } from 'vite'

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    reporters: ['default','verbose'],
  },
})
