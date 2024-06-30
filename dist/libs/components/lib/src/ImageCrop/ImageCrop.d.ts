
export interface Props {
    aspect: number;
    callbackFn: (imgSrc: string) => Promise<string>;
    callbackLabel: string;
    imgSrc: string;
    subTitle?: string;
    title: string;
}
export declare const ImageCrop: (props: Props) => import("react/jsx-runtime").JSX.Element;
