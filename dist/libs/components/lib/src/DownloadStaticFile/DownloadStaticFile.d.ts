export interface IProps {
    file: {
        name: string;
        size: number;
        downloadUrl?: string | undefined;
    };
    forDonationRequest?: boolean;
    isLoggedIn?: boolean;
    allowDownload?: boolean;
    handleClick?: () => void;
    redirectToSignIn?: () => Promise<void>;
}
export declare const DownloadStaticFile: ({ file, allowDownload, handleClick, redirectToSignIn, forDonationRequest, isLoggedIn, }: IProps) => import("react/jsx-runtime").JSX.Element | null;
