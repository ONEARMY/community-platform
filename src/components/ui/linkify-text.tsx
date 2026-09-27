import Linkify from 'linkify-react';
import { cn } from '@/lib/utils';

type LinkifyTextProps = {
  children?: React.ReactNode;
};

type LinkRendererProps = {
  attributes?: React.AnchorHTMLAttributes<HTMLAnchorElement>;
  content?: React.ReactNode;
};

function LinkifyText({ children }: LinkifyTextProps) {
  const renderLink = ({ attributes = {}, content }: LinkRendererProps) => (
    <a
      {...attributes}
      className={cn('text-muted-foreground underline', attributes.className)}
      target="_blank"
      rel="noopener noreferrer"
    >
      {content}
    </a>
  );

  return <Linkify options={{ render: { url: renderLink } }}>{children}</Linkify>;
}

export { LinkifyText };
