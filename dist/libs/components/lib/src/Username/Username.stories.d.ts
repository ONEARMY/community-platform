import { Meta } from '@storybook/react';
import { Username } from './Username';

declare const _default: Meta<typeof Username>;
export default _default;
export declare const Verified: {
    args: {
        user: {
            userName: string;
            countryCode: string;
            isSupporter: boolean;
            isVerified: boolean;
        };
    };
};
export declare const Unverified: {
    args: {
        user: {
            countryCode: string;
            userName: string;
            isVerified: boolean;
            isSupporter: boolean;
        };
    };
};
export declare const VerifiedSupporter: {
    args: {
        user: {
            countryCode: string;
            userName: string;
            isVerified: boolean;
            isSupporter: boolean;
        };
    };
};
export declare const UnverifiedSupporter: {
    args: {
        user: {
            countryCode: string;
            userName: string;
            isVerified: boolean;
            isSupporter: boolean;
        };
    };
};
export declare const WithoutFlag: {
    args: {
        user: {
            userName: string;
        };
    };
};
export declare const InvalidCountryCode: {
    args: {
        user: {
            userName: string;
            countryCode: string;
        };
    };
};
export declare const InlineStyles: {
    args: {
        user: {
            userName: string;
        };
        sx: {
            outline: string;
        };
    };
};
