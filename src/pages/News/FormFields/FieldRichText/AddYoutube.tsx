import type { Editor } from '@tiptap/react';
import { SquarePlay } from 'lucide-react';
import { Button, Modal } from 'oa-components';
import { extractYouTubeId } from 'oa-shared';
import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from 'src/components/ui/tooltip';
import { Box, Flex, Input } from 'theme-ui';

interface IProps {
  editor: Editor;
}

export const AddYoutube = ({ editor }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const close = () => {
    setIsOpen(false);
    setUrl('');
    setError(null);
  };

  const handleConfirm = () => {
    const videoId = extractYouTubeId(url.trim());
    if (!videoId) {
      setError('Enter a valid YouTube URL.');
      return;
    }
    editor.chain().focus().insertContent({ type: 'youtube', attrs: { videoId } }).run();
    close();
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              small
              variant="subtle"
              type="button"
              aria-label="Insert YouTube video"
              onClick={() => setIsOpen(true)}
            />
          }
        >
          <SquarePlay size={16} />
        </TooltipTrigger>
        <TooltipContent>Insert YouTube video</TooltipContent>
      </Tooltip>

      <Modal isOpen={isOpen} width={420} onDismiss={close}>
        <Flex sx={{ flexDirection: 'column', gap: 2 }}>
          {error && <Box sx={{ color: 'error', fontSize: 1 }}>{error}</Box>}
          <Input
            autoFocus
            value={url}
            placeholder="https://www.youtube.com/watch?v=..."
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleConfirm();
              }
            }}
          />
          <Flex sx={{ gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="secondary" type="button" onClick={close}>
              Cancel
            </Button>
            <Button variant="primary" type="button" onClick={handleConfirm}>
              Add video
            </Button>
          </Flex>
        </Flex>
      </Modal>
    </>
  );
};
