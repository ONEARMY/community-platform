import { defineConfig } from 'vite'

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    reporters: ['default','verbose'],
  },
})
