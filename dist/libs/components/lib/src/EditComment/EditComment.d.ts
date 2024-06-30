export interface IProps {
    comment: string;
    handleCancel: () => void;
    handleSubmit: (commentText: string) => void;
    isReply: boolean;
}
export declare const EditComment: (props: IProps) => import("react/jsx-runtime").JSX.Element;
