export interface DownloadFileFromLinkProps {
    link: string;
    handleClick?: () => Promise<void>;
    redirectToSignIn?: () => Promise<void>;
}
export declare const DownloadFileFromLink: (props: DownloadFileFromLinkProps) => import("react/jsx-runtime").JSX.Element;
