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
