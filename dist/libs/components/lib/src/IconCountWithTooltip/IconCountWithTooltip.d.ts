import { availableGlyphs } from '../Icon/types';

export interface IconCountWithTooltipProps {
    count: number;
    dataCy?: string;
    icon: availableGlyphs;
    text: string;
}
export declare const IconCountWithTooltip: (props: IconCountWithTooltipProps) => import("react/jsx-runtime").JSX.Element;
