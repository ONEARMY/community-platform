import { IGlyphs } from '../Icon/types';

export interface IProps {
    onClick: () => void;
    isLoggedIn?: boolean;
    label?: string;
    glyph?: keyof IGlyphs;
}
export declare const DownloadButton: ({ glyph, isLoggedIn, label, onClick, }: IProps) => import("react/jsx-runtime").JSX.Element;
