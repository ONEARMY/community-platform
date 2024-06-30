import { User } from '../types/common';

export interface Props {
    loading?: boolean;
    imageUrl: string;
    description: string;
    comments: string | null;
    user: User;
    heading: string;
    isEditable: boolean;
}
export declare const MapMemberCard: (props: Props) => import("react/jsx-runtime").JSX.Element;
