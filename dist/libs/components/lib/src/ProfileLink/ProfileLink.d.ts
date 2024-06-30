import { IGlyphs } from '../Icon/types';
import { ThemeUICSSObject } from 'theme-ui';

export interface Props {
    url: string;
    label: string;
    icon: keyof IGlyphs;
    sx?: ThemeUICSSObject;
}
export declare const capitalizeFirstLetter: (str: string) => string;
export declare const ProfileLink: (props: Props) => import("react/jsx-runtime").JSX.Element;
