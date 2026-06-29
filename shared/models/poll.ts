import { Profile } from './profile';

export class DBPoll {
  readonly id: number;
  title: string;
  singleChoice: boolean;
}

export class Poll {
  id: number;
  title: string;
  singleChoice: boolean;
}

export class DBPollOption {
  readonly id: number;
  pollId: number;
  description: string;
  voteCount: number;
}

export class PollOption {
  id: number;
  description: string;
  voteCount: number;
}

export class DBPollVotes {
  readonly id: number;
  readonly pollOptionId: number;
  readonly profileId: number;
}

export class PollVotes {
  pollOption: PollOption;
  profile: Profile;
}

export type PollDTO = {
  id: number;
  title: string;
  singleChoice: boolean;
  hasVoted: boolean;
  options: PollOptionDTO[];
};

export type PollOptionDTO = {
  id?: number;
  description: string;
  voteCount?: number;
  wasVotedByUser?: boolean;
};
