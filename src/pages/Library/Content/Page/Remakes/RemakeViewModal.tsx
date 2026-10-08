import { Button, Icon, Modal, Username } from 'oa-components';
import type { Remake } from 'oa-shared';
import { UserRole } from 'oa-shared';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import DefaultMemberImage from 'src/assets/images/default_member.svg';
import { Button as UiButton } from 'src/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'src/components/ui/dropdown-menu';
import MoreVertIcon from 'src/components/ui/icons/more-vert.svg?react';
import { useProfileStore } from 'src/stores/Profile/profile.store';
import { Box, Flex, Image, Text } from 'theme-ui';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DisplayDate } from '@/components/ui/display-date';
import { REMAKE_IMAGE_ASPECT_RATIO } from './constants';

interface IProps {
  remakes: Remake[];
  activeIndex: number;
  isNavDisabled?: boolean;
  onChangeIndex: (index: number) => void;
  onClose: () => void;
  onEdit: (remake: Remake) => void;
  onDelete: (remake: Remake) => void;
}

export const RemakeViewModal = (props: IProps) => {
  const { remakes, activeIndex, isNavDisabled, onChangeIndex, onClose, onEdit, onDelete } = props;
  const { profile } = useProfileStore();
  const [imageIndex, setImageIndex] = useState(0);

  const remake = remakes[activeIndex];

  const entersRemakeFromEndRef = useRef(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [dialogContainer, setDialogContainer] = useState<HTMLDialogElement | null>(null);
  const setContentRef = useCallback((node: HTMLDivElement | null) => {
    contentRef.current = node;
    setDialogContainer(node?.closest('dialog') ?? null);
  }, []);

  useEffect(() => {
    contentRef.current?.focus();
  }, []);

  useEffect(() => {
    const imagesOfRemake = remakes[activeIndex]?.images || [];

    setImageIndex(entersRemakeFromEndRef.current ? Math.max(imagesOfRemake.length - 1, 0) : 0);
    entersRemakeFromEndRef.current = false;
  }, [activeIndex, remakes]);

  const imageCount = remakes[activeIndex]?.images?.length || 0;

  useEffect(() => {
    if (isNavDisabled) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof Element && event.target.closest('[role="menu"]')) {
        return;
      }

      if (event.key === 'ArrowRight') {
        if (imageIndex < imageCount - 1) {
          setImageIndex(imageIndex + 1);
        } else if (activeIndex < remakes.length - 1) {
          onChangeIndex(activeIndex + 1);
        }
      }

      if (event.key === 'ArrowLeft') {
        if (imageIndex > 0) {
          setImageIndex(imageIndex - 1);
        } else if (activeIndex > 0) {
          entersRemakeFromEndRef.current = true;
          onChangeIndex(activeIndex - 1);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [imageIndex, imageCount, activeIndex, remakes.length, onChangeIndex, isNavDisabled]);

  const isEditable = useMemo(() => {
    if (!profile || !remake?.author) {
      return false;
    }

    return (
      profile.username === remake.author.username ||
      !!profile.roles?.includes(UserRole.ADMIN) ||
      !!profile.roles?.includes(UserRole.EDITOR)
    );
  }, [profile, remake]);

  if (!remake) {
    return null;
  }

  const images = remake.images || [];
  const hasPrevRemake = activeIndex > 0;
  const hasNextRemake = activeIndex < remakes.length - 1;

  const overlayButtonSx = {
    position: 'fixed' as const,
    width: '56px',
    height: '56px',
    padding: 0,
    justifyContent: 'center',
    color: 'white',
    zIndex: 1,
    '&:hover': { backgroundColor: 'transparent', opacity: 0.7 },
  };

  const navButtonSx = {
    ...overlayButtonSx,
    top: '50%',
    transform: 'translateY(-50%)',
    display: ['none', 'flex'],
  };

  const carouselButtonSx = {
    position: 'absolute' as const,
    top: '50%',
    transform: 'translateY(-50%)',
    width: '32px',
    height: '32px',
    padding: 0,
    justifyContent: 'center',
    backgroundColor: 'white',
    '&:hover': { backgroundColor: 'background' },
  };

  const stopModalDismiss = (event: React.MouseEvent) => event.stopPropagation();

  return (
    <Modal
      isOpen
      onDismiss={onClose}
      maxWidth="100vw"
      maxHeight={['calc(100vh - 112px)', '95vh', '95vh']}
      sx={{
        padding: 0,
        width: ['100vw', 'calc(100vw - 112px)', '1072px'],
      }}
    >
      <Button
        type="button"
        variant="subtle"
        icon="close"
        iconFilter="brightness(0) invert(1)"
        iconSize={18}
        showIconOnly
        data-cy="remake-modal-close"
        onClick={(event) => {
          stopModalDismiss(event);
          onClose();
        }}
        sx={{
          ...overlayButtonSx,
          top: 1,
          right: 1,
          width: ['44px', '56px', '56px'],
          height: ['44px', '56px', '56px'],
        }}
      >
        Close
      </Button>
      {hasPrevRemake && (
        <Button
          type="button"
          variant="subtle"
          icon="chevron-left"
          iconFilter="brightness(0) invert(1)"
          iconSize={36}
          showIconOnly
          data-cy="remake-modal-prev"
          onClick={(event) => {
            stopModalDismiss(event);
            onChangeIndex(activeIndex - 1);
          }}
          sx={{ ...navButtonSx, left: [0, 0, 1] }}
        >
          Previous remake
        </Button>
      )}
      {hasNextRemake && (
        <Button
          type="button"
          variant="subtle"
          icon="chevron-right"
          iconFilter="brightness(0) invert(1)"
          iconSize={36}
          showIconOnly
          data-cy="remake-modal-next"
          onClick={(event) => {
            stopModalDismiss(event);
            onChangeIndex(activeIndex + 1);
          }}
          sx={{ ...navButtonSx, right: [0, 0, 1] }}
        >
          Next remake
        </Button>
      )}

      <Flex
        ref={setContentRef}
        tabIndex={-1}
        data-cy="remake-view-modal"
        sx={{
          flexDirection: ['column-reverse', 'column-reverse', 'row'],
          overflow: 'hidden',
          outline: 'none',
          borderRadius: '8px',
        }}
      >
        <Flex
          sx={{
            flex: 1,
            minWidth: 0,
            flexDirection: 'column',
            gap: 2,
            paddingTop: 2,
            paddingLeft: [2, 3, 3],
            paddingRight: [2, 4, 4],
            paddingBottom: [8, 8, 4],
            maxHeight: ['35vh', '40vh', '456px'],
            overflowY: 'auto',
          }}
        >
          <Flex sx={{ alignItems: 'center', gap: 2 }}>
            <Avatar className="size-6 sm:size-10">
              {remake.author?.photo && (
                <AvatarImage
                  src={remake.author.photo.publicUrl}
                  alt={`Avatar of ${remake.author.displayName || 'remake author'}`}
                  loading="lazy"
                />
              )}
              <AvatarFallback>
                <img src={DefaultMemberImage} alt="" />
              </AvatarFallback>
            </Avatar>
            {remake.author && <Username user={remake.author} />}
            <Text sx={{ fontFamily: 'body', fontSize: 1, color: 'darkGrey', flex: 1 }}>
              <DisplayDate createdAt={remake.createdAt} showLabel={false} />
            </Text>
            {isEditable && (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <UiButton
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      data-cy="RemakeItem: actions button"
                    />
                  }
                >
                  <MoreVertIcon aria-hidden="true" className="size-3" />
                  <span className="sr-only">Show Actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent container={dialogContainer} className="min-w-34">
                  <DropdownMenuItem
                    size="default"
                    data-cy="remake-edit"
                    onClick={() => onEdit(remake)}
                  >
                    <Icon aria-hidden="true" glyph="edit" size={18} />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    size="default"
                    data-cy="remake-delete"
                    onClick={() => onDelete(remake)}
                  >
                    <Icon aria-hidden="true" glyph="delete" size={18} />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </Flex>
          {remake.description && (
            <Text
              data-cy="remake-description"
              sx={{
                fontFamily: 'body',
                fontSize: 2,
                lineHeight: 1.4,
                whiteSpace: 'pre-wrap',
                overflowWrap: 'anywhere',
              }}
            >
              {remake.description}
            </Text>
          )}
        </Flex>

        <Box
          sx={{
            position: 'relative',
            flex: [null, null, '0 0 61%'],
            aspectRatio: REMAKE_IMAGE_ASPECT_RATIO,
          }}
        >
          <Image
            src={images[imageIndex]?.publicUrl}
            alt={`Remake image ${imageIndex + 1} of ${images.length}`}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
          {images.length > 1 && (
            <>
              {imageIndex > 0 && (
                <Button
                  type="button"
                  variant="subtle"
                  icon="chevron-left"
                  showIconOnly
                  data-cy="remake-image-prev"
                  onClick={() => setImageIndex((prev) => prev - 1)}
                  sx={{ ...carouselButtonSx, left: 2 }}
                >
                  Previous image
                </Button>
              )}
              {imageIndex < images.length - 1 && (
                <Button
                  type="button"
                  variant="subtle"
                  icon="chevron-right"
                  showIconOnly
                  data-cy="remake-image-next"
                  onClick={() => setImageIndex((prev) => prev + 1)}
                  sx={{ ...carouselButtonSx, right: 2 }}
                >
                  Next image
                </Button>
              )}
              <Flex
                sx={{
                  position: 'absolute',
                  bottom: 2,
                  left: 0,
                  right: 0,
                  justifyContent: 'center',
                  gap: 1,
                }}
              >
                {images.map((image, index) => (
                  <Box
                    key={image.id}
                    sx={{
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      backgroundColor: index === imageIndex ? 'white' : 'lightgrey',
                    }}
                  />
                ))}
              </Flex>
            </>
          )}
        </Box>
      </Flex>
    </Modal>
  );
};
