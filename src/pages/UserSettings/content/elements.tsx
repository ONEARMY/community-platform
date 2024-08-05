import { Field } from 'react-final-form'
import styled from '@emotion/styled'
import { Flex } from 'theme-ui'

export const Label = (props) => (
  <Flex
    as="label"
    sx={{
      flexDirection: ['row', 'row', 'column'],
      m: '5px',
      p: '10px 0',
      borderRadius: '5px',
      border: 'background',
      ':hover': {
        backgroundColor: 'background',
        cursor: 'pointer',
      },
      '&.selected': {
        backgroundColor: 'background',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'green',
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

export const FlexSectionContainer = (props) => (
  <Flex sx={{ flexDirection: 'column', gap: 2 }}>{props.children}</Flex>
)
