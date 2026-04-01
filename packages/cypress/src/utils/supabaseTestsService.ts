import { createClient } from '@supabase/supabase-js';

import { MOCK_DATA } from '../data';

import type { SupabaseClient, User } from '@supabase/supabase-js';
import type { DBProfile, DBProfileBadge, DBProfileTag, DBProfileType, DBResearchItem, Profile, TenantSettings } from 'oa-shared';

type SeedData = {
  [tableName: string]: Array<Record<string, any>>;
};

export class SupabaseTestsService {
  private client: SupabaseClient<any, 'public', 'public', any, any>;
  private adminClient: SupabaseClient<any, 'public', 'public', any, any>;
  private tenantId: string;

  constructor(apiUrl: string, secretKey: string, tenantId: string) {
    this.tenantId = tenantId.toLowerCase();
    this.client = createClient(apiUrl, secretKey, {
      global: {
        headers: {
          'x-tenant-id': this.tenantId,
        },
      },
    });

    this.adminClient = createClient(apiUrl, secretKey, {
      global: {
        headers: {
          'x-tenant-id': this.tenantId,
        },
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  async deleteAccounts() {
    let page = 1;
    const toDelete: string[] = [];

    while (true) {
      const { data, error } = await this.adminClient.auth.admin.listUsers({ perPage: 1000, page });
      if (error) throw new Error(`listUsers failed: ${error.message}`);
      if (!data.users.length) break;

      for (const user of data.users) {
        if (user.email?.includes(`+${this.tenantId}`)) {
          toDelete.push(user.id);
        }
      }

      if (data.users.length < 1000) break;
      page++;
    }

    console.log(`Deleting ${toDelete.length} auth users for tenant ${this.tenantId}`);
    for (const id of toDelete) {
      await this.adminClient.auth.admin.deleteUser(id);
    }
  }

  async seedDatabase(data: SeedData) {
    const results: Record<string, any> = {};

    for (const [table, rows] of Object.entries(data)) {
      const result = await this.client.from(table).insert(rows).select();

      if (!result.error) {
        results[table] = result;
        continue;
      }

      results[table] = result;
    }

    return results;
  }

  async clearDatabase(tables: string[], tenantId: string) {
    // sequential so there are no constraint issues
    for (const table of tables) {
      await this.client.from(table).delete().eq('tenant_id', tenantId);
    }
  }

  async createStorage(tenantId: string) {
    await this.adminClient.storage.createBucket(tenantId, {
      public: true,
    });

    await this.adminClient.storage.createBucket(tenantId + '-documents');
  }

  async clearStorage(tenantId: string) {
    await this.manuallyEmptyBucket(tenantId);
    await this.adminClient.storage.deleteBucket(tenantId);

    await this.manuallyEmptyBucket(tenantId + '-documents');
    await this.adminClient.storage.deleteBucket(tenantId + '-documents');
  }

  async manuallyEmptyBucket (bucketName: string, path = '') {
    const limit = 100;
    let offset = 0;

    while (true) {
      const { data, error } = await this.adminClient.storage
        .from(bucketName)
        .list(path, { limit, offset });

      if (error || !data || data.length === 0) break;

      const folders = data.filter((item) => item.metadata === null);
      const files = data.filter((item) => item.metadata !== null);

      if (files.length > 0) {
        const paths = files.map((f) => (path ? `${path}/${f.name}` : f.name));
        await this.adminClient.storage.from(bucketName).remove(paths);
      }

      for (const folder of folders) {
        const folderPath = path ? `${path}/${folder.name}` : folder.name;
        await this.manuallyEmptyBucket(bucketName, folderPath);
      }

      if (data.length < limit) break; // last page
      offset += limit;
    }
  };

  async getUserProfileByUsername(username: string) {
    const { data, error } = await this.client.from('profiles').select().eq('username', username).maybeSingle();

    if (error || !data) {
      return error;
    }

    return data;
  }

  async seedResearch(profiles: DBProfile[], tagsData) {
    const { categories } = await this.seedCategories('research');

    const researchData: Partial<DBResearchItem & { tenant_id: string }>[] = [];

    for (let i = 0; i < MOCK_DATA.research.length; i++) {
      const item = MOCK_DATA.research[i];
      const createdBy: number = profiles.find((profile) => profile.username === item.created_by_username)?.id || profiles[0].id;

      researchData.push({
        created_at: item.created_at,
        deleted: item.deleted,
        modified_at: item.modified_at,
        description: item.description,
        slug: item.slug,
        previous_slugs: item.previous_slugs,
        title: item.title,
        status: item.status,
        created_by: createdBy,
        is_draft: item.is_draft,
        published_at: item.is_draft ? null : item.created_at,
        tags: [tagsData.data[0].id, tagsData.data[1].id],
        category: categories.data[i % 2].id,
        tenant_id: this.tenantId,
      });
    }

    const { research } = await this.seedDatabase({
      research: researchData,
    });

    for (let i = 0; i < MOCK_DATA.research.length; i++) {
      const researchItem = MOCK_DATA.research[i];
      const createdBy = profiles.find((profile) => profile.username === researchItem.created_by_username).id || profiles[0].id;

      if (researchItem.updates) {
        const { research_updates } = await this.seedDatabase({
          research_updates: MOCK_DATA.researchUpdates.map((item) => ({
            created_at: item.created_at,
            deleted: item.deleted,
            description: item.description,
            modified_at: item.modified_at,
            title: item.title,
            research_id: research.data[i].id,
            created_by: createdBy,
            published_at: item.created_at,
            tenant_id: this.tenantId,
          })),
        });

        // Only seed comments for first research
        if (i === 0) {
          const { comments } = await this.seedComment(profiles, research_updates, 'research_update');

          await this.seedReply(profiles, comments, research);
        }
      }
    }
  }

  async seedCategories(type: string) {
    return await this.seedDatabase({
      categories: MOCK_DATA.categories.map((category) => ({
        ...category,
        type,
        tenant_id: this.tenantId,
      })),
    });
  }

  async seedProfileTags() {
    const response = await this.seedDatabase({
      profile_tags: MOCK_DATA.profileTags.map((category) => ({
        ...category,
        tenant_id: this.tenantId,
      })),
    });

    return response;
  }

  async seedProfileTypes() {
    const response = await this.seedDatabase({
      profile_types: MOCK_DATA.profileTypes.map((type) => ({
        ...type,
        tenant_id: this.tenantId,
      })),
    });

    return response;
  }

  async seedTags() {
    return await this.seedDatabase({
      tags: MOCK_DATA.tags.map((category) => ({
        ...category,
        tenant_id: this.tenantId,
      })),
    });
  }

  async seedTenantSettings() {
    return await this.seedDatabase({
      tenant_settings: [
        {
          site_name: 'Test Site',
          site_description: 'Test description',
          site_url: 'https://community.preciousplastic.com',
          academy_resource: 'https://onearmy.github.io/academy/',
          color_primary: '#fee77b',
          color_primary_hover: '#ffde45',
          color_accent: '#fee77b',
          color_accent_hover: '#ffde45',
          show_impact: true,
          create_research_roles: undefined,
          tenant_id: this.tenantId,
        },
      ],
    });
  }

  async seedQuestions(profiles) {
    const { categories } = await this.seedCategories('questions');

    const { questions } = await this.seedDatabase({
      questions: MOCK_DATA.questions.map((question) => ({
        ...question,
        tenant_id: this.tenantId,
        created_by: profiles[0].id,
        category: categories.data[0].id,
        published_at: question.created_at,
      })),
    });

    const { comments } = await this.seedComment(profiles, questions, 'questions');
    await this.seedUsefulVotes(profiles, questions, 'questions');
    await this.seedReply(profiles, comments, questions);
  }

  async seedUsefulVotes(profiles, sourceData, sourceType) {
    const usefulVotesData = await this.seedDatabase({
      useful_votes: [
        {
          created_at: new Date().toUTCString(),
          content_id: sourceData.data[0].id,
          content_type: sourceType,
          user_id: profiles[0].id,
          tenant_id: this.tenantId,
        },
      ],
    });
    return usefulVotesData;
  }

  async seedComment(profiles, sourceData, sourceType) {
    const commentData = await this.seedDatabase({
      comments: [
        {
          tenant_id: this.tenantId,
          created_at: new Date().toUTCString(),
          comment: 'First comment',
          created_by: profiles[0].id,
          source_type: sourceType,
          source_id: sourceData.data[0].id,
        },
      ],
    });
    return commentData;
  }

  async seedReply(profiles, comments, source) {
    await this.seedDatabase({
      comments: [
        {
          tenant_id: this.tenantId,
          created_at: new Date().toUTCString(),
          comment: 'First Reply',
          created_by: profiles[0].id,
          source_type: comments.data[0].source_type,
          source_id: source.data[0].id,
          parent_id: comments.data[0].id,
        },
      ],
    });
  }

  async seedNews(profiles, tagsData) {
    const { categories } = await this.seedCategories('news');

    const { news } = await this.seedDatabase({
      news: MOCK_DATA.news.map((news) => ({
        ...news,
        created_by: profiles[0].id,
        tags: [tagsData.data[0].id, tagsData.data[1].id],
        category: categories.data[0].id,
        tenant_id: this.tenantId,
        published_at: news.created_at,
      })),
    });

    const { comments } = await this.seedComment(profiles, news, 'news');
    await this.seedReply(profiles, comments, news);
  }

  async seedMap(profiles) {
    const response = await this.seedDatabase({
      map_pins: MOCK_DATA.mapPins.map((pin, index) => ({
        profile_id: profiles[index].id,
        tenant_id: this.tenantId,
        ...pin,
      })),
    });

    return response;
  }

  async seedLibrary(profiles, tagsData) {
    const { categories } = await this.seedCategories('projects');

    const projectsData = [];

    for (let i = 0; i < MOCK_DATA.projects.length; i++) {
      const item = MOCK_DATA.projects[i];

      projectsData.push({
        created_at: item.createdAt,
        modified_at: item.modifiedAt,
        title: item.title,
        description: item.description,
        slug: item.slug,
        time: item.time,
        difficulty_level: item.difficultyLevel,
        created_by: profiles.find((x) => x.username === item.createdBy).id || null,
        tags: [tagsData.data[0].id, tagsData.data[1].id],
        category: categories.data[i % 2].id,
        deleted: item.deleted,
        moderation: item.moderation,
        tenant_id: this.tenantId,
        published_at: item.createdAt,
        ...(item.moderationFeedback ? { moderation_feedback: item.moderationFeedback } : {}),
      });
    }

    // seed projects
    const { projects } = await this.seedDatabase({
      projects: projectsData,
    });

    // seed steps
    for (let i = 0; i < MOCK_DATA.projects.length; i++) {
      const project = MOCK_DATA.projects[i];

      if (project.steps && project.steps.length) {
        await this.seedDatabase({
          project_steps: project.steps.map((item) => ({
            title: item.title,
            project_id: projects.data[i].id,
            description: item.description,
            video_url: item.video_url,
            tenant_id: this.tenantId,
          })),
        });
      }
    }

    // seed comments
    const { comments } = await this.seedComment(profiles, projects, 'projects');
    await this.seedReply(profiles, comments, projects);
  }

  async seedBadges() {
    const response = await this.seedDatabase({
      profile_badges: MOCK_DATA.badges.map((badge) => ({
        ...badge,
        tenant_id: this.tenantId,
      })),
    });

    return response;
  }

  async seedUpgradeBadges(profileBadges: DBProfileBadge[]) {
    const proBadge = profileBadges.find((badge) => badge.name === 'pro');

    if (!proBadge) {
      return { upgrade_badge: { data: [] } };
    }

    const response = await this.seedDatabase({
      upgrade_badge: [
        {
          tenant_id: this.tenantId,
          action_label: 'Go PRO',
          badge_id: proBadge.id,
          is_space: true, // Only for workspaces
          action_url: 'https://www.preciousplastic.com/pro-membership',
        },
      ],
    });

    return response;
  }

  async seedProfileImages(): Promise<{ id: string; path: string; fullPath: string }[]> {
    const { data: image1Data } = await this.client.storage.from(this.tenantId).upload('profiles/image1.png', new Blob());

    const { data: image2Data } = await this.client.storage.from(this.tenantId).upload('profiles/image2.png', new Blob());

    return [image1Data, image2Data];
  }

  async seedAccounts(profileBadges, profileTags, profileTypes, profileImages) {
    await this.deleteAccounts();

    const accounts = Object.values(MOCK_DATA.users).map((user) => ({
      ...user,
      email: user['email'].replace('@', `+${this.tenantId}@`),
      password: user['password'],
    }));

    const profiles: DBProfile[] = [];

    for (const account of accounts) {
      const profileType = profileTypes.find((t) => t.name === account.profileType) || profileTypes[0];
      const profile = await this.createAuthAndProfile(
        account,
        profileBadges[0].id,
        [profileTags[0].id, profileTags[1].id],
        profileType.id,
        profileImages,
      );
      profiles.push(profile);
    }

    return { profiles };
  }

  async createAuthAndProfile(user, profileBadgeId, profilTagIds, profileTypeId, profileImages) {
    const authUser = await this.adminClient.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: { username: user.username },
    });

    let authId: string;

    if (authUser.error?.code === 'email_exists' || authUser.error?.code === 'user_already_exists') {
      // Shouldn't happen after deleteAccounts, but handle it gracefully
      // Supabase lowercases emails on storage, so compare case-insensitively
      console.warn(`User ${user.email} already exists after deleteAccounts - looking up...`);

      let found: { id: string } | undefined;
      let page = 1;

      while (!found) {
        const { data, error } = await this.adminClient.auth.admin.listUsers({ perPage: 1000, page });
        if (error) throw new Error(`listUsers failed: ${error.message}`);
        if (!data.users.length) break;
        found = data.users.find(u => u.email?.toLowerCase() === user.email.toLowerCase());
        if (data.users.length < 1000) break;
        page++;
      }

      if (!found) throw new Error(`User ${user.email} not found after email_exists error`);
      authId = found.id;

    } else if (authUser.error) {
      throw new Error(`Failed to create user ${user.email}: ${authUser.error.message}`);
    } else {
      authId = authUser.data.user.id;
    }

    return await this.createProfile(user, authId, profileBadgeId, profilTagIds, profileTypeId, profileImages);
  }

  async createProfile(
    user: Partial<Profile>,
    authId: string,
    profileBadgeId: number,
    profilTagIds: number[],
    profileTypeId: number,
    profileImages: { id: string; path: string; fullPath: string }[],
  ) {
    const { data } = await this.adminClient.from('profiles').select('*').eq('auth_id', authId).eq('tenant_id', this.tenantId).maybeSingle();

    if (data) {
      console.log(`Profile already exists for ${user.username}, reusing...`);
      return data;
    }

    console.log(`Creating profile for ${user.username} with auth_id ${authId} and roles:`, user.roles);

    const profileDB: Partial<DBProfile> & { tenant_id: string } = {
      created_at: user.createdAt,
      auth_id: authId,
      display_name: user.displayName,
      username: user.username,
      roles: user.roles,
      tenant_id: this.tenantId,
      profile_type: profileTypeId,
      about: user.about || '',
      photo: user.photo ? profileImages[0] : null,
      country: user.country,
      cover_images: user.coverImages || ([] as any),
      impact: JSON.stringify(user.impact) || null,
      is_blocked_from_messaging: user.isBlockedFromMessaging || false,
      is_contactable: user.isContactable || true,
      last_active: user.lastActive || null,
      website: user.website || null,
    };

    const profileResult = await this.adminClient.from('profiles').insert(profileDB).select('*');

    if (profileResult.error) {
      throw new Error(`Failed to create profile for ${user.username}: ${profileResult.error.message}`);
    }

    if (!profileResult.data || profileResult.data.length === 0) {
      throw new Error(`Profile creation returned no data for ${user.username}`);
    }

    if (profileResult.data[0].username === 'demo_user') {
      await this.seedDatabase({
        profile_badges_relations: [
          {
            profile_id: profileResult.data[0].id,
            profile_badge_id: profileBadgeId,
            tenant_id: this.tenantId,
          },
        ],
      });
    }

    await Promise.all(
      profilTagIds.map(async (profileTag) => {
        return this.seedDatabase({
          profile_tags_relations: [
            {
              profile_id: profileResult.data[0].id,
              profile_tag_id: profileTag,
              tenant_id: this.tenantId,
            },
          ],
        });
      }),
    );

    return profileResult.data[0];
  }
}
