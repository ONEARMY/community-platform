import { ThemeUIStyleObject } from 'theme-ui';

export type ResearchEditorOverviewUpdate = {
    isActive: boolean;
    title: string;
    status: 'draft' | 'published';
    slug: string | null;
};
export interface ResearchEditorOverviewProps {
    updates: ResearchEditorOverviewUpdate[];
    researchSlug: string;
    newItemTitle?: string;
    showCreateUpdateButton?: boolean;
    showBackToResearchButton?: boolean;
    sx?: ThemeUIStyleObject;
}
export declare const ResearchEditorOverview: (props: ResearchEditorOverviewProps) => import("react/jsx-runtime").JSX.Element;
