import styled from '@emotion/styled'
import { Card, Flex } from 'theme-ui'
import { Field } from 'react-final-form'

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
  <Card mt={4} style={{ overflow: 'visible' }}>
    <Flex p={4} sx={{ flexWrap: 'nowrap', flexDirection: 'column' }}>
      {props.children}
    </Flex>
  </Card>
)
