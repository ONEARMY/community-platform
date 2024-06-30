export interface UserStatisticsProps {
    userName: string;
    country?: string;
    isVerified: boolean;
    isSupporter?: boolean;
    howtoCount: number;
    usefulCount: number;
    researchCount: number;
}
export declare const UserStatistics: (props: UserStatisticsProps) => import("react/jsx-runtime").JSX.Element | null;
