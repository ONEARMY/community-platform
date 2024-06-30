import { PhotoSwipeOptions } from 'photoswipe/lightbox';

export interface IImageGalleryItem {
    downloadUrl: string;
    thumbnailUrl: string;
    contentType?: string | null;
    fullPath: string;
    name: string;
    type: string;
    size: number;
    timeCreated: string;
    updated: string;
}
export interface ImageGalleryProps {
    images: IImageGalleryItem[];
    allowPortrait?: boolean;
    photoSwipeOptions?: PhotoSwipeOptions;
    hideThumbnails?: boolean;
    showNextPrevButton?: boolean;
}
export declare const ImageGallery: (props: ImageGalleryProps) => import("react/jsx-runtime").JSX.Element | null;
