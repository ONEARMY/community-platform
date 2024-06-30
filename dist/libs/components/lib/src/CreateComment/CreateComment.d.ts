export interface Props {
    maxLength: number;
    isLoggedIn: boolean;
    isLoading?: boolean;
    isReply?: boolean;
    onSubmit: (value: string) => void;
    onChange: (value: string) => void;
    comment: string;
    placeholder?: string;
    userProfileType?: string;
    buttonLabel?: string;
}
export declare const CreateComment: (props: Props) => import("react/jsx-runtime").JSX.Element;
