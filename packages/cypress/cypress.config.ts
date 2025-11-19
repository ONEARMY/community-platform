// cypress.config.ts
import { defineConfig } from 'cypress';

import { SupabaseTestsService } from './src/utils/supabaseTestsService';

export default defineConfig({
  defaultCommandTimeout: 15000,
  watchForFileChanges: true,
  chromeWebSecurity: false,
  video: true,
  reporter: 'junit',
  reporterOptions: {
    mochaFile: 'coverage/out-[hash].xml',
  },
  downloadsFolder: 'src/downloads',
  fixturesFolder: 'src/fixtures',
  screenshotsFolder: 'src/screenshots',
  videosFolder: 'src/videos',
  projectId: '4s5zgo',
  viewportWidth: 1000,
  viewportHeight: 1000,
  retries: {
    runMode: 2,
    openMode: 0,
  },
  e2e: {
    setupNodeEvents: (on, config) => {
      const supabaseUrl = config.env.SUPABASE_API_URL;
      const supabaseKey = config.env.SUPABASE_SERVICE_ROLE_KEY;
      const tenantId = config.env.TENANT_ID;

      on('task', {
        log(message) {
          // eslint-disable-next-line no-console
          console.log(message);
          return null;
        },

        async 'seed database'() {
          if (!supabaseUrl || !supabaseKey) {
            throw new Error(
              'SUPABASE_API_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required',
            );
          }

          const supabaseService = new SupabaseTestsService(supabaseUrl, supabaseKey, tenantId);
          await supabaseService.createStorage(tenantId);

          const profileImages = await supabaseService.seedProfileImages();
          const { profile_types } = await supabaseService.seedProfileTypes();
          const { profile_badges } = await supabaseService.seedBadges();
          const { profile_tags } = await supabaseService.seedProfileTags();
          const { profiles } = await supabaseService.seedAccounts(
            profile_badges.data,
            profile_tags.data,
            profile_types.data,
            profileImages,
          );

          await supabaseService.seedMap(profiles);

          const { tags } = await supabaseService.seedTags();
          await supabaseService.seedQuestions(profiles);
          await supabaseService.seedNews(profiles, tags);
          await supabaseService.seedResearch(profiles, tags);
          await supabaseService.seedLibrary(profiles, tags);
          return null;
        },
        async 'clear database'() {
          const supabaseUrl = config.env.SUPABASE_API_URL;
          const supabaseKey = config.env.SUPABASE_SERVICE_ROLE_KEY;
          const tenantId = config.env.TENANT_ID;

          const supabaseService = new SupabaseTestsService(supabaseUrl, supabaseKey, tenantId);

          await supabaseService.clearDatabase(
            [
              'categories',
              'comments',
              'news',
              'research',
              'research_updates',
              'notifications',
              'notifications_preferences',
              'profiles',
              'questions',
              'projects',
              'project_steps',
              'tags',
              'profile_badges',
              'profile_badges_relations',
              'profile_tags',
              'profile_tags_relations',
              'profile_types',
            ],
            tenantId,
          );

          await supabaseService.clearStorage(tenantId);
        },
      });

      return config;
    },
    baseUrl: 'http://localhost:3456',
    specPattern: 'src/integration/**/*.{js,jsx,ts,tsx}',
    supportFile: 'src/support/index.ts',
    experimentalStudio: true,
  },
});
