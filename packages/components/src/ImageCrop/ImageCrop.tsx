// An edited version of https://codesandbox.io/p/sandbox/react-image-crop-demo-with-react-hooks-y831o

import React, { useRef, useState } from 'react';
import { ReactCrop } from 'react-image-crop';
import { Box, Flex, Text } from 'theme-ui';

import { Button } from '../Button/Button';
import { Loader } from '../Loader/Loader';
import { canvasPreview } from './canvasPreview';
import { centerAspectCrop } from './centerAspectCrop';
import { useDebounceEffect } from './useDebounceEffect';

import type { Crop, PixelCrop } from 'react-image-crop';

import 'react-image-crop/dist/ReactCrop.css';

export interface Props {
  aspect: number;
  callbackFn: (imgSrc: string) => Promise<string>;
  callbackLabel: string;
  imgSrc: string;
  subTitle?: string;
  title: string;
}

const IMAGE_QUALITY = 90;
const SCALE = 1;

export const ImageCrop = (props: Props) => {
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const blobUrlRef = useRef('');

  const { aspect, callbackFn, callbackLabel, imgSrc, subTitle, title } = props;

  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, aspect));
  }

  async function onDownloadCropClick() {
    setIsLoading(true);

    const image = imgRef.current;
    const previewCanvas = previewCanvasRef.current;

    if (!image || !previewCanvas || !completedCrop) {
      throw new Error('Crop canvas does not exist');
    }

    // This will size relative to the uploaded image
    // size. If you want to size according to what they
    // are looking at on screen, remove scaleX + scaleY
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const offscreen = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
    );
    const ctx = offscreen.getContext('2d');
    if (!ctx) {
      throw new Error('No 2d context');
    }

    ctx.drawImage(
      previewCanvas,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height,
      0,
      0,
      offscreen.width,
      offscreen.height,
    );
    const blob = await offscreen.convertToBlob({
      type: 'image/jpeg',
      quality: IMAGE_QUALITY,
    });

    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
    }
    blobUrlRef.current = URL.createObjectURL(blob);

    await callbackFn(blobUrlRef.current);
    setIsLoading(false);
  }

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop, SCALE);
      }
    },
    100,
    [completedCrop, SCALE],
  );

  const padding = 3;

  return (
    <>
      <Box sx={{ padding }}>
        <Text>{title}</Text>
        <br />
        <Text variant="quiet">{subTitle}</Text>
      </Box>

      <Flex
        sx={{
          borderBottom: '2px dashed silver',
          borderTop: '2px dashed silver',
          padding,
        }}
      >
        {isLoading && (
          <Box sx={{ flex: 1 }}>
            <Loader label="Uploading image now. It'll only a sec. Hopefully." />
          </Box>
        )}

        {!isLoading && !!imgSrc && (
          <Flex sx={{ flex: 1, justifyContent: 'center' }}>
            <ReactCrop
              aspect={aspect}
              crop={crop}
              minHeight={100}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
            >
              <img
                alt="Crop me"
                data-testid="cropImage"
                onLoad={onImageLoad}
                ref={imgRef}
                src={imgSrc}
              />
            </ReactCrop>
          </Flex>
        )}
      </Flex>

      <Box sx={{ padding }}>
        <Button type="button" onClick={onDownloadCropClick} disabled={isLoading}>
          {callbackLabel}
        </Button>
      </Box>
    </>
  );
};
