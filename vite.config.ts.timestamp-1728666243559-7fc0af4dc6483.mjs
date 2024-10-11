// vite.config.ts
import { vitePlugin as remix } from "file:///E:/Repos/onearmy.apps/node_modules/@remix-run/dev/dist/index.js";
import react from "file:///E:/Repos/onearmy.apps/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "file:///E:/Repos/onearmy.apps/node_modules/vite/dist/node/index.js";
import svgr from "file:///E:/Repos/onearmy.apps/node_modules/vite-plugin-svgr/dist/index.js";
import ViteTsConfigPathsPlugin from "file:///E:/Repos/onearmy.apps/node_modules/vite-tsconfig-paths/dist/index.mjs";
var __vite_injected_original_import_meta_url = "file:///E:/Repos/onearmy.apps/vite.config.ts";
var __filename = fileURLToPath(__vite_injected_original_import_meta_url);
var __dirname = dirname(__filename);
var vitestConfig = {
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts",
    teardownTimeout: 2e4,
    testTimeout: 2e4,
    coverage: {
      provider: "v8",
      reporter: ["text"]
    },
    include: ["./src/**/*.test.?(c|m)[jt]s?(x)"],
    logHeapUsage: true,
    sequence: {
      hooks: "list"
    }
  }
};
var vite_config_default = defineConfig({
  define: {
    global: "globalThis"
  },
  plugins: [
    !process.env.VITEST ? remix({
      appDirectory: "./src",
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true
      }
    }) : react(),
    // TODO - confirm if required (given manual resolutions below)
    ViteTsConfigPathsPlugin({
      root: "./"
    }),
    // support import of svg files
    svgr()
  ],
  // open browser with server (note, will open at 127.0.1 not localhost on node <17)
  // https://vitejs.dev/config/server-options.html#server-options
  ssr: {
    noExternal: ["remix-utils", "@mui/base", "@mui/utils", "@mui/types"]
  },
  resolve: {
    alias: {
      "oa-shared": resolve(__dirname, "./shared/index.ts"),
      "oa-components": resolve(__dirname, "./packages/components/src/index.ts")
    }
  },
  test: vitestConfig.test
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxSZXBvc1xcXFxvbmVhcm15LmFwcHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkU6XFxcXFJlcG9zXFxcXG9uZWFybXkuYXBwc1xcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRTovUmVwb3Mvb25lYXJteS5hcHBzL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgdml0ZVBsdWdpbiBhcyByZW1peCB9IGZyb20gJ0ByZW1peC1ydW4vZGV2J1xyXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnXHJcbmltcG9ydCB7IGRpcm5hbWUsIHJlc29sdmUgfSBmcm9tICdwYXRoJ1xyXG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSAndXJsJ1xyXG4vLy8gPHJlZmVyZW5jZSB0eXBlcz1cInZpdGVzdFwiIC8+XHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXHJcbmltcG9ydCBzdmdyIGZyb20gJ3ZpdGUtcGx1Z2luLXN2Z3InXHJcbmltcG9ydCBWaXRlVHNDb25maWdQYXRoc1BsdWdpbiBmcm9tICd2aXRlLXRzY29uZmlnLXBhdGhzJ1xyXG5cclxuaW1wb3J0IHR5cGUgeyBVc2VyQ29uZmlnIGFzIFZpdGVzdFVzZXJDb25maWdJbnRlcmZhY2UgfSBmcm9tICd2aXRlc3QvY29uZmlnJ1xyXG5cclxuY29uc3QgX19maWxlbmFtZSA9IGZpbGVVUkxUb1BhdGgoaW1wb3J0Lm1ldGEudXJsKVxyXG5jb25zdCBfX2Rpcm5hbWUgPSBkaXJuYW1lKF9fZmlsZW5hbWUpXHJcblxyXG5jb25zdCB2aXRlc3RDb25maWc6IFZpdGVzdFVzZXJDb25maWdJbnRlcmZhY2UgPSB7XHJcbiAgdGVzdDoge1xyXG4gICAgZW52aXJvbm1lbnQ6ICdqc2RvbScsXHJcbiAgICBnbG9iYWxzOiB0cnVlLFxyXG4gICAgc2V0dXBGaWxlczogJy4vc3JjL3Rlc3Qvc2V0dXAudHMnLFxyXG4gICAgdGVhcmRvd25UaW1lb3V0OiAyMDAwMCxcclxuICAgIHRlc3RUaW1lb3V0OiAyMDAwMCxcclxuICAgIGNvdmVyYWdlOiB7XHJcbiAgICAgIHByb3ZpZGVyOiAndjgnLFxyXG4gICAgICByZXBvcnRlcjogWyd0ZXh0J10sXHJcbiAgICB9LFxyXG4gICAgaW5jbHVkZTogWycuL3NyYy8qKi8qLnRlc3QuPyhjfG0pW2p0XXM/KHgpJ10sXHJcbiAgICBsb2dIZWFwVXNhZ2U6IHRydWUsXHJcbiAgICBzZXF1ZW5jZToge1xyXG4gICAgICBob29rczogJ2xpc3QnLFxyXG4gICAgfSxcclxuICB9LFxyXG59XHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIGRlZmluZToge1xyXG4gICAgZ2xvYmFsOiAnZ2xvYmFsVGhpcycsXHJcbiAgfSxcclxuICBwbHVnaW5zOiBbXHJcbiAgICAhcHJvY2Vzcy5lbnYuVklURVNUXHJcbiAgICAgID8gcmVtaXgoe1xyXG4gICAgICAgICAgYXBwRGlyZWN0b3J5OiAnLi9zcmMnLFxyXG4gICAgICAgICAgZnV0dXJlOiB7XHJcbiAgICAgICAgICAgIHYzX2ZldGNoZXJQZXJzaXN0OiB0cnVlLFxyXG4gICAgICAgICAgICB2M19yZWxhdGl2ZVNwbGF0UGF0aDogdHJ1ZSxcclxuICAgICAgICAgICAgdjNfdGhyb3dBYm9ydFJlYXNvbjogdHJ1ZSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSlcclxuICAgICAgOiByZWFjdCgpLFxyXG4gICAgLy8gVE9ETyAtIGNvbmZpcm0gaWYgcmVxdWlyZWQgKGdpdmVuIG1hbnVhbCByZXNvbHV0aW9ucyBiZWxvdylcclxuICAgIFZpdGVUc0NvbmZpZ1BhdGhzUGx1Z2luKHtcclxuICAgICAgcm9vdDogJy4vJyxcclxuICAgIH0pLFxyXG4gICAgLy8gc3VwcG9ydCBpbXBvcnQgb2Ygc3ZnIGZpbGVzXHJcbiAgICBzdmdyKCksXHJcbiAgXSxcclxuICAvLyBvcGVuIGJyb3dzZXIgd2l0aCBzZXJ2ZXIgKG5vdGUsIHdpbGwgb3BlbiBhdCAxMjcuMC4xIG5vdCBsb2NhbGhvc3Qgb24gbm9kZSA8MTcpXHJcbiAgLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9zZXJ2ZXItb3B0aW9ucy5odG1sI3NlcnZlci1vcHRpb25zXHJcbiAgc3NyOiB7XHJcbiAgICBub0V4dGVybmFsOiBbJ3JlbWl4LXV0aWxzJywgJ0BtdWkvYmFzZScsICdAbXVpL3V0aWxzJywgJ0BtdWkvdHlwZXMnXSxcclxuICB9LFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgICdvYS1zaGFyZWQnOiByZXNvbHZlKF9fZGlybmFtZSwgJy4vc2hhcmVkL2luZGV4LnRzJyksXHJcbiAgICAgICdvYS1jb21wb25lbnRzJzogcmVzb2x2ZShfX2Rpcm5hbWUsICcuL3BhY2thZ2VzL2NvbXBvbmVudHMvc3JjL2luZGV4LnRzJyksXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgdGVzdDogdml0ZXN0Q29uZmlnLnRlc3QsXHJcbn0pXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBdVAsU0FBUyxjQUFjLGFBQWE7QUFDM1IsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsU0FBUyxlQUFlO0FBQ2pDLFNBQVMscUJBQXFCO0FBRTlCLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sVUFBVTtBQUNqQixPQUFPLDZCQUE2QjtBQVBtSCxJQUFNLDJDQUEyQztBQVd4TSxJQUFNLGFBQWEsY0FBYyx3Q0FBZTtBQUNoRCxJQUFNLFlBQVksUUFBUSxVQUFVO0FBRXBDLElBQU0sZUFBMEM7QUFBQSxFQUM5QyxNQUFNO0FBQUEsSUFDSixhQUFhO0FBQUEsSUFDYixTQUFTO0FBQUEsSUFDVCxZQUFZO0FBQUEsSUFDWixpQkFBaUI7QUFBQSxJQUNqQixhQUFhO0FBQUEsSUFDYixVQUFVO0FBQUEsTUFDUixVQUFVO0FBQUEsTUFDVixVQUFVLENBQUMsTUFBTTtBQUFBLElBQ25CO0FBQUEsSUFDQSxTQUFTLENBQUMsaUNBQWlDO0FBQUEsSUFDM0MsY0FBYztBQUFBLElBQ2QsVUFBVTtBQUFBLE1BQ1IsT0FBTztBQUFBLElBQ1Q7QUFBQSxFQUNGO0FBQ0Y7QUFHQSxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixRQUFRO0FBQUEsSUFDTixRQUFRO0FBQUEsRUFDVjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsQ0FBQyxRQUFRLElBQUksU0FDVCxNQUFNO0FBQUEsTUFDSixjQUFjO0FBQUEsTUFDZCxRQUFRO0FBQUEsUUFDTixtQkFBbUI7QUFBQSxRQUNuQixzQkFBc0I7QUFBQSxRQUN0QixxQkFBcUI7QUFBQSxNQUN2QjtBQUFBLElBQ0YsQ0FBQyxJQUNELE1BQU07QUFBQTtBQUFBLElBRVYsd0JBQXdCO0FBQUEsTUFDdEIsTUFBTTtBQUFBLElBQ1IsQ0FBQztBQUFBO0FBQUEsSUFFRCxLQUFLO0FBQUEsRUFDUDtBQUFBO0FBQUE7QUFBQSxFQUdBLEtBQUs7QUFBQSxJQUNILFlBQVksQ0FBQyxlQUFlLGFBQWEsY0FBYyxZQUFZO0FBQUEsRUFDckU7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLGFBQWEsUUFBUSxXQUFXLG1CQUFtQjtBQUFBLE1BQ25ELGlCQUFpQixRQUFRLFdBQVcsb0NBQW9DO0FBQUEsSUFDMUU7QUFBQSxFQUNGO0FBQUEsRUFDQSxNQUFNLGFBQWE7QUFDckIsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
