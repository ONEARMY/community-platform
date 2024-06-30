import { ImageProps } from 'theme-ui';

export interface Props extends ImageProps {
    size?: number;
    profileType?: string;
    useLowDetailVersion?: boolean;
}
export declare const MemberBadge: (props: Props) => import("react/jsx-runtime").JSX.Element;
