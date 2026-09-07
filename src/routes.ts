import { type RouteConfig } from '@react-router/dev/routes';
import { flatRoutes } from '@react-router/fs-routes';

// Exclude co-located unit tests (e.g. api.organisation-application.test.ts) from file-based routing
export default flatRoutes({ ignoredRouteFiles: ['**/*.test.*'] }) satisfies RouteConfig;
