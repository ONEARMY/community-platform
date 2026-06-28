import { SupabaseClient } from '@supabase/supabase-js';
import { PollDTO } from 'oa-shared/models/poll';
import { conflictError } from '../utils/httpException';

export class PollServiceServer {
  constructor(private client: SupabaseClient) {}

  async createPoll(dto: PollDTO): Promise<number> {
    if (dto.id) {
      throw conflictError('Poll already exists with this id! Id: ' + dto.id);
    }

    const pollResult = await this.client
      .from('polls')
      .insert({
        title: dto.title,
        single_choice: dto.singleChoice,
        tenant_id: process.env.TENANT_ID,
      })
      .select('id')
      .single();

    if (pollResult.error || !pollResult.data) {
      throw pollResult.error;
    }

    const pollId = pollResult.data.id;

    const options = dto.options.map((option) => ({
      poll_id: pollId,
      description: option.description,
      tenant_id: process.env.TENANT_ID,
    }));

    const optionsResult = await this.client.from('poll_options').insert(options);

    if (optionsResult.error) {
      throw optionsResult.error;
    }

    return pollId;
  }

  async updatePoll(dto: PollDTO): Promise<number> {
    if (!dto.id) {
      throw conflictError('Cannot update non-existing poll!');
    }

    const pollResult = await this.client
      .from('polls')
      .update({
        title: dto.title,
        single_choice: dto.singleChoice,
      })
      .eq('id', dto.id);

    if (pollResult.error) {
      throw pollResult.error;
    }

    // 1. load all options already attached to the poll
    // 2. compare the ids with the updated list of options
    // 3. update the options that were already present
    // 4. insert new options without ids
    // 5. delete options that are no longer part of the poll

    const existingOptionsResult = await this.client
      .from('poll_options')
      .select('id, description')
      .eq('poll_id', dto.id);

    if (existingOptionsResult.error) {
      throw existingOptionsResult.error;
    }

    const existingOptions = existingOptionsResult.data;
    const existingIds = new Set(existingOptions.map((x) => x.id));

    const incomingIds = new Set(dto.options.filter((x) => x.id).map((x) => x.id!));

    const removedIds = [...existingIds].filter((id) => !incomingIds.has(id));

    for (const option of dto.options.filter((x) => x.id)) {
      const updateOptionsResult = await this.client
        .from('poll_options')
        .update({
          description: option.description,
        })
        .eq('id', option.id);

      if (updateOptionsResult.error) {
        throw updateOptionsResult.error;
      }
    }

    const newOptions = dto.options.filter((x) => !x.id);

    if (newOptions.length) {
      const newOptionsResult = await this.client.from('poll_options').insert(
        newOptions.map((x) => ({
          poll_id: dto.id,
          description: x.description,
          tenant_id: process.env.TENANT_ID,
        })),
      );

      if (newOptionsResult.error) {
        throw newOptionsResult.error;
      }
    }

    for (const id of removedIds) {
      const removeOptionsResult = await this.client
        .from('poll_options')
        .delete()
        .eq('id', id)
        .select();

      if (removeOptionsResult.error) {
        throw removeOptionsResult.error;
      }
    }

    return dto.id;
  }

  async getPoll(
    pollId: number,
    profileId: number | null = null,
    isAdmin: boolean = false,
  ): Promise<PollDTO | null> {
    const result = await this.client.rpc('get_poll_with_permissions', {
      p_poll_id: pollId,
      p_profile_id: profileId,
      p_is_admin: isAdmin,
    });

    if (result.error) {
      throw result.error;
    }

    return result.data as PollDTO | null;
  }

  async deletePoll(id: number): Promise<void> {
    const result = await this.client.from('polls').delete().eq('id', id);

    if (result.error) {
      throw result.error;
    }
  }

  async vote(pollId: number, optionIds: number[], profileId: number): Promise<void> {
    const pollResult = await this.client
      .from('polls')
      .select('id,single_choice')
      .eq('id', pollId)
      .single();

    if (pollResult.error || !pollResult.data) {
      throw pollResult.error;
    }

    if (pollResult.data.single_choice && optionIds.length > 1) {
      throw new Error('Only one option may be selected');
    }

    const optionsResult = await this.client
      .from('poll_options')
      .select('id,poll_id')
      .in('id', optionIds);

    if (optionsResult.error) {
      throw optionsResult.error;
    }

    const validOptions = optionsResult.data?.every((x) => x.poll_id === pollId) ?? false;

    if (!validOptions) {
      throw new Error('One or more options do not belong to this poll');
    }

    const votes = optionIds.map((optionId) => ({
      poll_option_id: optionId,
      profile_id: profileId,
      tenant_id: process.env.TENANT_ID,
    }));

    const previousVotes = await this.client
      .from('poll_votes')
      .select('*')
      .eq('poll_id', pollId)
      .eq('profile_id', profileId);

    if ((previousVotes.data?.length ?? 0) > 0) {
      throw new Error('This user already voted for this poll');
    }

    const voteResult = await this.client.from('poll_votes').insert(votes);

    if (voteResult.error) {
      throw voteResult.error;
    }
  }
}
