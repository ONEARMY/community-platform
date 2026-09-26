import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import ReactPlayer from 'react-player';
import { cn } from '@/lib/utils';

const videoPlayerVariants = cva('relative w-full overflow-hidden rounded-md bg-muted', {
  variants: {
    aspectRatio: {
      video: 'aspect-video',
      square: 'aspect-square',
      auto: 'aspect-auto',
    },
  },
  defaultVariants: {
    aspectRatio: 'video',
  },
});

export interface VideoPlayerProps
  extends React.ComponentProps<'div'>,
    VariantProps<typeof videoPlayerVariants> {
  videoUrl: string;
  light?: boolean | string;
  controls?: boolean;
}

export function VideoPlayer({
  videoUrl,
  light = true,
  controls = true,
  aspectRatio,
  className,
  ...props
}: VideoPlayerProps) {
  return (
    <div
      data-testid="VideoPlayer"
      data-slot="video-player"
      className={cn(videoPlayerVariants({ aspectRatio, className }))}
      {...props}
    >
      <ReactPlayer url={videoUrl} width="100%" height="100%" controls={controls} light={light} />
    </div>
  );
}
