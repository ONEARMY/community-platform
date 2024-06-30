import { Meta } from '@storybook/react';
import { MapMemberCard } from './MapMemberCard';

declare const _default: Meta<typeof MapMemberCard>;
export default _default;
export declare const Default: {
    args: {
        imageUrl: string;
        description: string;
        user: {
            countryCode: string;
            userName: string;
            isSupporter: boolean;
            isVerified: boolean;
        };
        heading: string;
        isEditable: boolean;
        comments: null;
    };
};
export declare const LoadingState: {
    args: {
        loading: boolean;
        imageUrl: string;
        description: string;
        user: {
            countryCode: string;
            userName: string;
            isSupporter: boolean;
            isVerified: boolean;
        };
        heading: string;
        isEditable: boolean;
    };
};
export declare const ModerationComments: {
    args: {
        imageUrl: string;
        description: string;
        comments: string;
        user: {
            countryCode: string;
            userName: string;
            isSupporter: boolean;
            isVerified: boolean;
        };
        heading: string;
        isEditable: boolean;
    };
};
