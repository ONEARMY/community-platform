type Step = {
    text: string;
    link?: string;
};
export interface BreadcrumbsProps {
    steps: Step[];
}
export declare const Breadcrumbs: ({ steps }: BreadcrumbsProps) => import("react/jsx-runtime").JSX.Element;
export {};
