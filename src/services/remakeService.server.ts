import type { SupabaseClient } from '@supabase/supabase-js';
import type { DBProfile, DBRemake, RemakeDTO } from 'oa-shared';
import { REMAKE_MAX_DESCRIPTION_LENGTH, REMAKE_MAX_IMAGES, Remake, UserRole } from 'oa-shared';
import { forbiddenError, notFoundError, validationError } from 'src/utils/httpException';
import { ImageServiceServer } from './imageService.server';

const REMAKE_SELECT = `
  id,
  created_at,
  modified_at,
  project_id,
  created_by,
  description,
  images,
  profile:profiles(id, display_name, username, photo, country)
`;

export class RemakeServiceServer {
  private imageService: ImageServiceServer;

  constructor(private client: SupabaseClient) {
    this.imageService = new ImageServiceServer(client);
  }

  async getByProjectId(projectId: number): Promise<Remake[]> {
    const { data, error } = await this.client
      .from('remakes')
      .select(REMAKE_SELECT)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return (data as unknown as DBRemake[]).map((remake) => this.toRemake(remake));
  }

  async getCountByProjectId(projectId: number): Promise<number> {
    const { count, error } = await this.client
      .from('remakes')
      .select('id', { count: 'exact', head: true })
      .eq('project_id', projectId);

    if (error) {
      console.error(error);
      return 0;
    }

    return count ?? 0;
  }

  async create(projectId: number, profile: DBProfile, dto: RemakeDTO): Promise<Remake> {
    this.validateDto(dto);

    const { data, error } = await this.client
      .from('remakes')
      .insert({
        project_id: projectId,
        created_by: profile.id,
        description: dto.description || null,
        images: this.toDbImages(dto),
        tenant_id: process.env.TENANT_ID,
      })
      .select(REMAKE_SELECT)
      .single();

    if (error || !data) {
      throw error || new Error('Remake creation returned no record');
    }

    return this.toRemake(data as unknown as DBRemake);
  }

  async update(
    remakeId: number,
    projectId: number,
    profile: DBProfile,
    dto: RemakeDTO,
  ): Promise<Remake> {
    this.validateDto(dto);

    const dbRemake = await this.getDbRemake(remakeId, projectId);
    this.ensureCanModify(dbRemake, profile);

    const { data, error } = await this.client
      .from('remakes')
      .update({
        description: dto.description || null,
        images: this.toDbImages(dto),
        modified_at: new Date().toISOString(),
      })
      .eq('id', remakeId)
      .select(REMAKE_SELECT)
      .single();

    if (error || !data) {
      throw error || new Error('Remake update returned no record');
    }

    return this.toRemake(data as unknown as DBRemake);
  }

  async remove(remakeId: number, projectId: number, profile: DBProfile): Promise<void> {
    const dbRemake = await this.getDbRemake(remakeId, projectId);
    this.ensureCanModify(dbRemake, profile);

    const { error } = await this.client.from('remakes').delete().eq('id', remakeId);

    if (error) {
      throw error;
    }
  }

  private async getDbRemake(remakeId: number, projectId: number): Promise<DBRemake> {
    const { data, error } = await this.client
      .from('remakes')
      .select(REMAKE_SELECT)
      .eq('id', remakeId)
      .single();

    if (error || !data) {
      throw notFoundError('Remake');
    }

    const dbRemake = data as unknown as DBRemake;

    if (dbRemake.project_id !== projectId) {
      throw notFoundError('Remake');
    }

    return dbRemake;
  }

  private toDbImages(dto: RemakeDTO) {
    return dto.images.map((image) => ({
      id: image.id,
      path: image.path,
      fullPath: image.fullPath,
    }));
  }

  private ensureCanModify(remake: DBRemake, profile: DBProfile) {
    const isModerator =
      profile.roles?.includes(UserRole.ADMIN) || profile.roles?.includes(UserRole.EDITOR);

    if (remake.created_by !== profile.id && !isModerator) {
      throw forbiddenError();
    }
  }

  private validateDto(dto: RemakeDTO) {
    if (!dto.images || !Array.isArray(dto.images) || dto.images.length === 0) {
      throw validationError('Upload at least 1 image', 'images');
    }

    if (dto.images.length > REMAKE_MAX_IMAGES) {
      throw validationError(`You can upload up to ${REMAKE_MAX_IMAGES} images.`, 'images');
    }

    if (
      dto.images.some(
        (image) =>
          typeof image?.id !== 'string' ||
          typeof image?.path !== 'string' ||
          typeof image?.fullPath !== 'string',
      )
    ) {
      throw validationError('Invalid image data', 'images');
    }

    if (dto.description && typeof dto.description !== 'string') {
      throw validationError('Invalid description', 'description');
    }

    if (dto.description && dto.description.length > REMAKE_MAX_DESCRIPTION_LENGTH) {
      throw validationError(
        `Description must be under ${REMAKE_MAX_DESCRIPTION_LENGTH} characters`,
        'description',
      );
    }
  }

  private toRemake(dbRemake: DBRemake): Remake {
    const images = this.imageService.getPublicUrls(dbRemake.images ?? []);
    const authorPhoto = dbRemake.profile?.photo
      ? this.imageService.getPublicUrl(dbRemake.profile.photo)
      : undefined;

    return Remake.fromDB(dbRemake, images, authorPhoto);
  }
}
