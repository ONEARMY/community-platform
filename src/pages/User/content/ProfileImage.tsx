import type { Profile } from 'oa-shared';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import ChevronLeft from '@/components/ui/icons/chevron-left.svg?react';
import ChevronRight from '@/components/ui/icons/chevron-right.svg?react';

interface IProps {
  images: NonNullable<Profile['coverImages']>;
  alt: string;
}

export const ProfileImage = ({ images, alt }: IProps) => {
  const [index, setIndex] = useState(0);
  const step = (delta: number) => setIndex((index + delta + images.length) % images.length);

  return (
    <div className="relative sm:-mx-2 desktop-nav:-mx-4">
      <img
        data-cy="profile-cover-image"
        src={images[index].publicUrl}
        alt={alt}
        className="aspect-hero w-full object-cover"
      />
      {images.length > 1 && (
        <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-4">
          <Button
            variant="outline"
            size="icon"
            aria-label="Previous image"
            onClick={() => step(-1)}
          >
            <ChevronLeft />
          </Button>
          <Button variant="outline" size="icon" aria-label="Next image" onClick={() => step(1)}>
            <ChevronRight />
          </Button>
        </div>
      )}
    </div>
  );
};
