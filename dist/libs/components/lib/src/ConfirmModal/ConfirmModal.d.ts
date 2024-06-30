export interface Props {
    message: string;
    confirmButtonText: string;
    isOpen: boolean;
    handleCancel: () => void;
    handleConfirm: () => void;
}
export declare const ConfirmModal: (props: Props) => import("react/jsx-runtime").JSX.Element;
