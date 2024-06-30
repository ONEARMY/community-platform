export interface Props {
    commentId: string;
    isLoggedIn: boolean;
    maxLength: number;
    onSubmit: (_id: string, reply: string) => Promise<void>;
}
export declare const CreateReply: (props: Props) => import("react/jsx-runtime").JSX.Element;
