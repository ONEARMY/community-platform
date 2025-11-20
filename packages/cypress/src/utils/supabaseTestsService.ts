import { createClient } from '@supabase/supabase-js';

import { MOCK_DATA } from '../data';

import type { SupabaseClient, User } from '@supabase/supabase-js';
import type {
  DBProfile,
  DBProfileBadge,
  DBProfileTag,
  DBProfileType,
  DBResearchItem,
  Profile,
} from 'oa-shared';

type SeedData = {
  [tableName: string]: Array<Record<string, any>>;
};

export class SupabaseTestsService {
  private client: SupabaseClient<any, 'public', 'public', any, any>;
  private adminClient: SupabaseClient<any, 'public', 'public', any, any>;
  private tenantId: string;

  constructor(apiUrl: string, secretKey: string, tenantId: string) {
    this.tenantId = tenantId;
    this.client = createClient(apiUrl, secretKey, {
      global: {
        headers: {
          'x-tenant-id': tenantId,
        },
      },
    });

    this.adminClient = createClient(apiUrl, secretKey, {
      global: {
        headers: {
          'x-tenant-id': tenantId,
        },
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  async deleteAccounts() {
    const mockUsers = new Set(
      Object.values(MOCK_DATA.users)
        .filter((x) => !!x['email'])
        .map((x) => x['email']),
    );
    const result = await this.adminClient.auth.admin.listUsers();

    for (const user of result.data.users) {
      // only delete mock users and test users
      if (mockUsers.has(user.email) || user.email!.endsWith('@resend.dev')) {
        await this.adminClient.auth.admin.deleteUser(user.id);
      }
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

      results[table] = await this.client.from(table).select();
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
    await this.adminClient.storage.emptyBucket(tenantId);
    await this.adminClient.storage.deleteBucket(tenantId);

    await this.adminClient.storage.emptyBucket(tenantId + '-documents');
    await this.adminClient.storage.deleteBucket(tenantId + '-documents');
  }

  async getUserProfileByUsername(username: string) {
    const { data, error } = await this.client
      .from('profiles')
      .select()
      .eq('username', username)
      .single();

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
      const createdBy: number =
        profiles.find((profile) => profile.username === item.created_by_username)?.id ||
        profiles[0].id;

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
      const createdBy =
        profiles.find((profile) => profile.username === researchItem.created_by_username).id ||
        profiles[0].id;

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
            tenant_id: this.tenantId,
          })),
        });

        // Only seed comments for first research
        if (i === 0) {
          const { comments } = await this.seedComment(
            profiles,
            research_updates,
            'research_update',
          );

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

  async seedQuestions(profiles) {
    const { categories } = await this.seedCategories('questions');

    const { questions } = await this.seedDatabase({
      questions: MOCK_DATA.questions.map((question) => ({
        ...question,
        tenant_id: this.tenantId,
        created_by: profiles[0].id,
        category: categories.data[0].id,
      })),
    });

    const { comments } = await this.seedComment(profiles, questions, 'questions');
    await this.seedReply(profiles, comments, questions);
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

  async seedProfileImages(): Promise<{ id: string; path: string; fullPath: string }[]> {
    const { data: image1Data } = await this.client.storage
      .from(this.tenantId)
      .upload('profiles/image1.png', new Blob());

    const { data: image2Data } = await this.client.storage
      .from(this.tenantId)
      .upload('profiles/image2.png', new Blob());

    return [image1Data, image2Data];
  }

  // Creates user accounts and respective profiles
  async seedAccounts(
    profileBadges: DBProfileBadge[],
    profileTags: DBProfileTag[],
    profileTypes: DBProfileType[],
    profileImages: { id: string; path: string; fullPath: string }[],
  ) {
    const accounts = Object.values(MOCK_DATA.users).map((user) => ({
      email: user['email'],
      password: user['password'],
      ...user,
    }));

    const existingUsers = await this.adminClient.auth.admin.listUsers({
      perPage: 10000,
    });

    const profiles = await Promise.all(
      accounts.map(async (account) => {
        const profileType =
          profileTypes.find((type) => type.name === account.profileType) || profileTypes[0];

        return await this.createAuthAndProfile(
          account,
          existingUsers.data.users,
          profileBadges[0].id,
          [profileTags[0].id, profileTags[1].id],
          profileType.id,
          profileImages,
        );
      }),
    );

    return { profiles };
  }

  async createAuthAndProfile(
    user: any,
    existingUsers: User[],
    profileBadgeId: number,
    profilTagIds: number[],
    profileTypeId: number,
    profileImages: { id: string; path: string; fullPath: string }[],
  ) {
    const authUser = await this.adminClient.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: {
        username: user.username,
      },
    });

    let authId: string;

    if (authUser.error?.code === 'email_exists') {
      const existingUser = existingUsers.find((existingUser) => existingUser.email === user.email);

      authId = existingUser.id;
    } else if (authUser.data?.user?.id) {
      authId = authUser.data.user.id;
    }

    return await this.createProfile(
      user,
      authId,
      profileBadgeId,
      profilTagIds,
      profileTypeId,
      profileImages,
    );
  }

  async createProfile(
    user: Partial<Profile>,
    authId: string,
    profileBadgeId: number,
    profilTagIds: number[],
    profileTypeId: number,
    profileImages: { id: string; path: string; fullPath: string }[],
  ) {
    const { data } = await this.adminClient
      .from('profiles')
      .select('*')
      .eq('auth_id', authId)
      .eq('tenant_id', this.tenantId)
      .single();

    if (data) {
      return data;
    }

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

    if (!profileResult.data || profileResult.data.length === 0) {
      console.error('Failed to create profile');
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

    Promise.all(
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
