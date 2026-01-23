import { useEffect, useMemo, useState } from 'react';
import { Box, Button } from 'theme-ui';

import { CommentSectionSupabase } from './CommentSectionSupabase';

import type { ResearchUpdate } from 'oa-shared';

type Props = {
  authors: number[];
  open: boolean;
  total: number;
  researchUpdate: ResearchUpdate;
};

const CollapsableCommentSection = (props: Props) => {
  const { authors, open, total, researchUpdate } = props;

  const [isOpen, setIsOpen] = useState(() => open || false);

  const buttonText = useMemo(() => {
    if (!isOpen) {
      switch (total) {
        case 0:
          return 'Start a discussion';
        case 1:
          return 'View 1 comment';
        default:
          return `View ${total} comments`;
      }
    }

    return 'Collapse Comments';
  }, [isOpen]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const hash = location.hash;

    // Check if there's an update_N parameter and extract the ID after the underscore
    const updateParam = Array.from(searchParams.keys()).find((key) => key.startsWith('update_'));
    const hasMatchingUpdate =
      updateParam && updateParam.split('_')[1] === researchUpdate.id.toString();

    // Check if there's a #comment:N hash
    const hasCommentHash = hash.startsWith('#comment:');

    if (hasMatchingUpdate && hasCommentHash) {
      setIsOpen(true);
    }
  }, [location?.search, location?.hash, researchUpdate.id]);

  return (
    <Box
      data-cy="CollapsableCommentSection"
      sx={{
        backgroundColor: isOpen ? '#e2edf7' : 'inherit',
        borderTop: '2px solid #111',
        padding: 2,
        transition: 'background-color 120ms ease-out',
      }}
    >
      <Button
        type="button"
        variant="subtle"
        sx={{
          fontSize: '14px',
          width: '100%',
          textAlign: 'center',
          display: 'block',
          marginBottom: isOpen ? 2 : 0,
          '&:hover': { bg: '#ececec' },
        }}
        onClick={() => setIsOpen((prev) => !prev)}
        backgroundColor={isOpen ? '#c2daf0' : '#e2edf7'}
        className={isOpen ? 'viewComments' : ''}
        data-cy="HideDiscussionContainer:button"
      >
        {buttonText}
      </Button>
      {isOpen && (
        <CommentSectionSupabase
          sourceId={researchUpdate.id}
          sourceType="research_updates"
          authors={authors}
        />
      )}
    </Box>
  );
};

export default CollapsableCommentSection;
