import type { Config } from '@react-router/dev/config';

export default {
  ssr: true,
  appDirectory: './src',
  future: {
    v8_trailingSlashAwareDataRequests: true,
    v8_passThroughRequests: true,
    v8_middleware: true,
    v8_viteEnvironmentApi: true,
    v8_splitRouteModules: true,
  },
} satisfies Config;
