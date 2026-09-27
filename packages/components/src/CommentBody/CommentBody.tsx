import styled from '@emotion/styled';
import Linkify from 'linkify-react';
import { useEffect, useRef, useState } from 'react';
import { Text } from 'theme-ui';

import { ExternalLink } from '../ExternalLink/ExternalLink';

interface IProps {
  body: string;
}
const SHORT_COMMENT = 129;

const CommentLink = styled(ExternalLink)`
  color: ${({ theme }) => (theme as any).colors.grey} !important;
  text-decoration: underline;
`;

const renderExternalLink = ({ attributes = {} as any, content = '' }) => {
  const { href, ...props } = attributes;

  return (
    <CommentLink href={href} {...props}>
      {content}
    </CommentLink>
  );
};

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
          lineHeight: 1.4,
          maxHeight,
          overflow: 'hidden',
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap',
          fontSize: [3],
        }}
      >
        <Linkify options={{ render: { url: renderExternalLink } }}>{body.trim()}</Linkify>
      </Text>
      {textHeight > SHORT_COMMENT && (
        <Text
          as="a"
          onClick={() => setShowMore((prev) => !prev)}
          sx={{
            color: 'gray',
            cursor: 'pointer',
            fontSize: [3],
          }}
        >
          {isShowMore ? 'Show less' : 'Show more'}
        </Text>
      )}
    </>
  );
};
