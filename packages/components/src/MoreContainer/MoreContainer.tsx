import styled from '@emotion/styled';
import { Box, useThemeUI } from 'theme-ui';

import WhiteBubble0 from '../../assets/images/white-bubble_0.svg';
import WhiteBubble1 from '../../assets/images/white-bubble_1.svg';
import WhiteBubble2 from '../../assets/images/white-bubble_2.svg';
import WhiteBubble3 from '../../assets/images/white-bubble_3.svg';

import type { BoxProps } from 'theme-ui';

export const MoreContainer = (props: BoxProps) => {
  const { theme } = useThemeUI() as any;
  const MoreModalContainer = styled(Box)`
    position: relative;
    max-width: 780px;
    &:after {
      content: '';
      background-image: url(\"${WhiteBubble0}\");
      width: 100%;
      height: 100%;
      z-index: ${theme.zIndex.behind};
      background-size: contain;
      background-repeat: no-repeat;
      position: absolute;
      top: 59%;
      transform: translate(-50%, -50%);
      left: 50%;
      max-width: 850px;
      background-position: center 10%;
    }
    @media only screen and (min-width: ${theme.breakpoints[0]}) {
      &:after {
        background-image: url(\"${WhiteBubble1}\");
      }
    }
    @media only screen and (min-width: ${theme.breakpoints[1]}) {
      &:after {
        background-image: url(\"${WhiteBubble2}\");
      }
    }

    @media only screen and (min-width: ${theme.breakpoints[2]}) {
      &:after {
        background-image: url(\"${WhiteBubble3}\");
      }
    }
  `;
  return <MoreModalContainer {...(props as any)}>{props.children}</MoreModalContainer>;
};
