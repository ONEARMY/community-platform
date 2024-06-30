export interface IProps {
    body: string | undefined;
    callback: () => void;
    iframeSrc: string | undefined;
    imageURL: string | undefined;
    link: string;
}
export declare const BUTTON_LABEL = "Download";
export declare const DonationRequest: (props: IProps) => import("react/jsx-runtime").JSX.Element;
