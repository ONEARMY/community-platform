import { IGlyphs } from './types';
import { SpaceProps, VerticalAlignProps } from 'styled-system';

export interface IProps {
    glyph: keyof IGlyphs;
    color?: string;
    size?: number | string;
    marginRight?: string;
    opacity?: string;
    onClick?: () => void;
}
export declare const glyphs: IGlyphs;
export type Props = IProps & VerticalAlignProps & SpaceProps;
export declare const Icon: (props: Props) => import("react").JSX.Element;
