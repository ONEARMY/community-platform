import { IComment } from './CommentItem/types';

export declare const fakeComment: (commentOverloads?: Partial<IComment>) => {
    text: string;
    isUserVerified: boolean;
    isUserSupporter: boolean;
    isEditable: boolean;
    creatorCountry: string | null;
    creatorName: string;
    creatorImage: string;
    _id: string;
    _edited?: string;
    _created: string;
    _deleted?: boolean;
    replies?: IComment[];
    _creatorId: string;
};
export declare const createFakeComments: (numberOfComments?: number, commentOverloads?: {}) => IComment[];
