import 'linkify-plugin-mention';

import styled from '@emotion/styled';
import Linkify from 'linkify-react';
import { useThemeUI } from 'theme-ui';

import { ExternalLink } from '../ExternalLink/ExternalLink';
import { InternalLink } from '../InternalLink/InternalLink';

export interface Props {
  children?: React.ReactNode;
}

export const LinkifyText = (props: Props) => {
  const { theme } = useThemeUI() as any;
  const StyledExternalLink = styled(ExternalLink)`
    color: ${theme.colors.grey}!important;
    text-decoration: underline;
  `;
  const StyledInternalLink = styled(InternalLink)`
    color: ${theme.colors.grey};
    font-weight: bold;
  `;

  const renderExternalLink = ({ attributes = {} as any, content = '' }) => {
    const { href, ...props } = attributes;
    return (
      <StyledExternalLink href={href} {...props}>
        {content}
      </StyledExternalLink>
    );
  };
  const renderInternalLink = ({ attributes = {} as any, content = '' }) => {
    const { href, ...props } = attributes;
    return (
      <StyledInternalLink to={`/u${href}`} {...props}>
        {content}
      </StyledInternalLink>
    );
  };

  return (
    <Linkify
      options={{
        render: {
          mention: renderInternalLink,
          url: renderExternalLink,
        },
      }}
    >
      {props.children}
    </Linkify>
  );
};
