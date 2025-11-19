export interface IVotedUseful {
  votedUsefulBy?: string[];
}

export interface ISharedFeatures extends IVotedUseful {
  total_views?: number;
  previousSlugs?: string[];
}

export type IVotedUsefulUpdate = {
  _id: string;
} & IVotedUseful;
