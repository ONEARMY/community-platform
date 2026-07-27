import { faker } from '@faker-js/faker';
import { PollDTO, PollOptionDTO } from 'oa-shared/models/poll';

export const FactoryPollData = (title?: string): PollDTO => ({
  id: faker.number.int(),
  title: title ?? faker.string.alphanumeric(),
  singleChoice: false,
  hasVoted: false,
  options: [FactoryPollOption('This'), FactoryPollOption('That'), FactoryPollOption('Both')],
});

export const FactoryPollOption = (description?: string): PollOptionDTO => ({
  id: faker.number.int(),
  description: description ?? faker.string.alphanumeric(),
  voteCount: undefined,
  wasVotedByUser: false,
});
