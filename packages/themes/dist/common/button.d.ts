import type { ThemeWithName } from '../types';
export declare const getButtons: (colors: ThemeWithName['colors']) => {
    primary: {
        color: string;
        bg: string;
        '&:hover': {
            bg: string;
            cursor: string;
        };
        '&[disabled]': {
            opacity: number;
            cursor: string;
        };
        '&[disabled]:hover': {
            bg: string;
        };
        fontFamily: string;
        fontSize: number;
        display: string;
        alignItems: string;
        position: string;
        transition: string;
        borderRadius: number;
        width: string;
        border: string;
    };
    secondary: {
        border: string;
        color: string;
        bg: string;
        '&:hover': {
            bg: string;
            cursor: string;
        };
        '&[disabled]': {
            opacity: number;
        };
        '&[disabled]:hover': {
            bg: string;
        };
        fontFamily: string;
        fontSize: number;
        display: string;
        alignItems: string;
        position: string;
        transition: string;
        borderRadius: number;
        width: string;
    };
    outline: {
        border: string;
        color: string;
        backgroundColor: string;
        '&:hover': {
            backgroundColor: string;
            cursor: string;
        };
        fontFamily: string;
        fontSize: number;
        display: string;
        alignItems: string;
        position: string;
        transition: string;
        borderRadius: number;
        width: string;
    };
    imageInput: {
        border: string;
        color: string;
        backgroundColor: string;
    };
    subtle: {
        borderColor: string;
        color: string;
        bg: string;
        '&:hover': {
            bg: string;
            borderColor: string;
            cursor: string;
        };
        '&[disabled]': {
            opacity: number;
        };
        '&[disabled]:hover': {
            bg: string;
        };
        fontFamily: string;
        fontSize: number;
        display: string;
        alignItems: string;
        position: string;
        transition: string;
        borderRadius: number;
        width: string;
        border: string;
    };
};
export declare type ButtonVariants = 'primary' | 'secondary' | 'outline' | 'disabled' | 'subtle';
