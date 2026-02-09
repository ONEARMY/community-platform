import { useEffect, useRef, useState } from 'react';
import { Text } from 'theme-ui';

import { LinkifyText } from '../LinkifyText/LinkifyText';

interface IProps {
  body: string;
}
const SHORT_COMMENT = 129;

export const CommentBody = ({ body }: IProps) => {
  const textRef = useRef<HTMLDivElement>(null);
  const [textHeight, setTextHeight] = useState(0);
  const [isShowMore, setShowMore] = useState(false);

  useEffect(() => {
    if (textRef.current) {
      setTextHeight(textRef.current.scrollHeight);
    }
  }, [body]);

  const maxHeight = isShowMore ? 'max-content' : '128px';

  return (
    <>
      <Text
        ref={textRef}
        data-cy="comment-text"
        data-testid="commentText"
        sx={{
          fontFamily: 'body',
          lineHeight: 1.3,
          maxHeight,
          overflow: 'hidden',
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap',
          fontSize: [2, 3],
        }}
      >
        <LinkifyText>{body.trim()}</LinkifyText>
      </Text>
      {textHeight > SHORT_COMMENT && (
        <Text
          as="a"
          onClick={() => setShowMore((prev) => !prev)}
          sx={{
            color: 'gray',
            cursor: 'pointer',
            fontSize: [2, 3],
          }}
        >
          {isShowMore ? 'Show less' : 'Show more'}
        </Text>
      )}
    </>
  );
};
