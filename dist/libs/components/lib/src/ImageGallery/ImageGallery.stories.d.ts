import { Meta, StoryFn } from '@storybook/react';
import { ImageGallery, IImageGalleryItem } from './ImageGallery';

export declare const testImages: IImageGalleryItem[];
declare const _default: Meta<typeof ImageGallery>;
export default _default;
export declare const Default: StoryFn<typeof ImageGallery>;
export declare const NoThumbnails: StoryFn<typeof ImageGallery>;
export declare const HideThumbnailForSingleImage: StoryFn<typeof ImageGallery>;
export declare const ShowNextPrevButtons: StoryFn<typeof ImageGallery>;
export declare const DoNotShowNextPrevButtons: StoryFn<typeof ImageGallery>;
