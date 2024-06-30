export interface IProps {
    body: string | undefined;
    callback: () => void;
    imageURL: string | undefined;
    iframeSrc: string | undefined;
    isOpen: boolean;
    link: string;
    onDidDismiss: () => void;
}
export declare const DonationRequestModal: (props: IProps) => import("react/jsx-runtime").JSX.Element;
