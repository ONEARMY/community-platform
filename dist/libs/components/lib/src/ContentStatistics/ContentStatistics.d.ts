import { availableGlyphs } from '../Icon/types';

export interface IProps {
    statistics: {
        icon: availableGlyphs;
        label: string;
    }[];
}
export declare const ContentStatistics: (props: IProps) => import("react/jsx-runtime").JSX.Element;
