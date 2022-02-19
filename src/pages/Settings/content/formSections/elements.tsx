import styled from 'styled-components'
import theme from 'src/themes/styled.theme'
import Flex from 'src/components/Flex'
import { Box } from 'rebass/styled-components'
import Icon from 'src/components/Icons'
import { Field } from 'react-final-form'

export const Label = props => (
  <Flex
    as="label"
    flexDirection={['row', 'row', 'column']}
    sx={{
      m: '5px',
      p: '10px 0',
      borderRadius: '5px',
      border: `${theme.colors.background}`,
      ':hover': {
        backgroundColor: `${theme.colors.background}`,
        cursor: 'pointer',
      },
      '&.selected': {
        backgroundColor: `${theme.colors.background}`,
        // eslint-disable-next-line
        border: '1px solid ' + `${theme.colors.green}`,
      },
    }}
    {...props}
  >
    {props.children}
  </Flex>
)

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
    flexWrap="nowrap"
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
