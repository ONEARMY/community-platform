import styled from '@emotion/styled';
import { Flex, Text } from 'theme-ui';

import { ExternalLink } from '../ExternalLink/ExternalLink';
import { Icon } from '../Icon/Icon';

type SiteFooterProps = {
  siteName: string;
};

const discordButtonWidth = 310;

const Anchor = styled(ExternalLink)`
  color: #fff;
  text-decoration: underline;
`;

const FooterContainer = styled(Flex)`
  color: #fff;
  display: flex;
  flex-direction: column;
  margin-top: 45px;
  line-heigh: 1.5;
  padding: 45px ${(props) => (props.theme as any).space[4]}px;
  position: relative;
  text-align: center;

  @media only screen and (min-width: ${(props) => (props.theme as any).breakpoints[1]}) and (max-width: ${(props) =>
      (props.theme as any).breakpoints[2]}) {
    align-items: flex-start;
    padding-top: 35px;
    padding-bottom: 35px;
    padding-left: 65px;
    padding-right: ${discordButtonWidth}px;
    text-align: left;
  }

  @media only screen and (min-width: ${(props) => (props.theme as any).breakpoints[2]}) {
    flex-direction: row;
    padding-right: ${discordButtonWidth}px;
    text-align: left;
  }
`;

const OneArmyIcon = styled(Icon)`
  @media only screen and (min-width: ${(props) => (props.theme as any).breakpoints[1]}) and (max-width: ${(props) =>
      (props.theme as any).breakpoints[2]}) {
    position: absolute;
    top: 45px;
    left: 30px;
  }
`;

export const SiteFooter = ({ siteName }: SiteFooterProps) => {
  return (
    <FooterContainer
      bg="#27272c"
      sx={{ alignItems: 'center' }}
      style={{
        marginTop: '45px',
      }}
    >
      <OneArmyIcon glyph={'star-active'} mb={[3, 3, 0]} />
      <Text ml={[0, 0, 0, 3]} mr={1}>
        {siteName} is a project by <Anchor href="https://onearmy.earth/">One Army</Anchor>.
      </Text>

      <Text mt={[2, 2, 0]}>
        Please <Anchor href="https://www.patreon.com/one_army">sponsor the work</Anchor> or{' '}
        <Anchor href="https://platform.onearmy.earth/">help&nbsp;us&nbsp;build&nbsp;the&nbsp;software</Anchor>.
      </Text>
    </FooterContainer>
  );
};
