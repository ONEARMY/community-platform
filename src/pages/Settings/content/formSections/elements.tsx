import styled from '@emotion/styled'
// TODO: Remove direct usage of Theme
import { preciousPlasticTheme } from 'oa-themes'
const theme = preciousPlasticTheme.styles
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

export const FlexSectionContainer = (props) => (
  <Card mt={4} style={{ overflow: 'visible' }}>
    <Flex p={4} sx={{ flexWrap: 'nowrap', flexDirection: 'column' }}>
      {props.children}
    </Flex>
  </Card>
)
