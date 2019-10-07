import * as React from 'react'
import styled from 'styled-components'
import { Field } from 'react-final-form'
import theme from 'src/themes/styled.theme'
import Flex from 'src/components/Flex'
import { Box } from 'rebass'
import Icon from 'src/components/Icons'

export const Label = styled.label`
  margin: 5px;
  padding: 10px 0;
  border-radius: 5px;
  border: 1px solid ${theme.colors.background};
  &:hover {
    background-color: ${theme.colors.background};
    cursor: pointer;
  }
  &.selected {
    background-color: ${theme.colors.background};
    border: 1px solid ${theme.colors.green};
  }
  &.full-width {
    flex: 1;
  }
`

export const HiddenInput = styled(Field)`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`

export const FlexSectionContainer = props => (
  <Flex
    card
    mediumRadius
    bg={'white'}
    p={4}
    mt={4}
    flexWrap="wrap"
    flexDirection="column"
  >
    {props.children}
  </Flex>
)

export const ArrowIsSectionOpen = props => (
  <Box
    height="20px"
    sx={{
      transform: props.isOpen ? 'rotate(180deg)' : null,
      transformOrigin: 'center',
      ':hover': {
        cursor: 'pointer',
      },
    }}
    {...props}
  >
    <Icon size="20" glyph="arrow-full-down" />
  </Box>
)
