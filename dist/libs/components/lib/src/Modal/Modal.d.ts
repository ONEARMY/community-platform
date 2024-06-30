import { ThemeUIStyleObject } from 'theme-ui';

export interface Props {
    isOpen: boolean;
    children?: React.ReactNode;
    width?: number;
    height?: number;
    onDidDismiss?: () => void;
    sx?: ThemeUIStyleObject | undefined;
}
export declare const Modal: (props: Props) => import("react/jsx-runtime").JSX.Element;
