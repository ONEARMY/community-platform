export interface TextNotificationProps {
    children: any;
    variant: 'success' | 'failure';
    isVisible: boolean;
    onDismiss?: any | null;
}
export declare const TextNotification: (props: TextNotificationProps) => import("react/jsx-runtime").JSX.Element;
