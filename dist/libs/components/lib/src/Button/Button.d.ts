import { IGlyphs } from '../Icon/types';
import { ButtonProps as ThemeUiButtonProps } from 'theme-ui';
import * as React from 'react';
export interface IBtnProps extends React.ButtonHTMLAttributes<HTMLElement> {
    icon?: keyof IGlyphs;
    disabled?: boolean;
    small?: boolean;
    large?: boolean;
    showIconOnly?: boolean;
    iconColor?: string;
}
export type BtnProps = IBtnProps & ThemeUiButtonProps;
export declare const Button: (props: BtnProps) => import("react/jsx-runtime").JSX.Element;
