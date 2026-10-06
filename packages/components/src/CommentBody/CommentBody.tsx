import { useThemeUI } from '@theme-ui/core';
import Linkify from 'linkify-react';
import { useEffect, useRef, useState } from 'react';
import { Text } from 'theme-ui';

interface IProps {
  body: string;
}
const SHORT_COMMENT = 129;

const renderExternalLink = ({ attributes = {} as any, content = '' }) => {
  const { href, ...props } = attributes;
  const { theme } = useThemeUI() as any;

  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={href}
      style={{
        color: theme.colors.grey,
        textDecoration: 'underline',
      }}
      {...props}
    >
      {content}
    </a>
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
