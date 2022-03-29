import { ISelectorList } from 'src/models/selectorList.models'

import styled from '@emotion/styled'
import theme from 'src/themes/styled.theme'
import {
  color,
  borderRadius,
  BorderRadiusProps,
  space,
  SpaceProps,
  fontSize,
  width,
  WidthProps,
} from 'styled-system'

import { Icon } from 'oa-components'

interface IProps {
  onChange?: () => void
  list: ISelectorList[]
}
type selectorProps = IProps & BorderRadiusProps & SpaceProps & WidthProps

const Wrapper = styled.div`
  ${color};
  ${borderRadius};
  ${space};
  ${width};
  border: 1px solid ${theme.colors.black};
  display: inline-block;
  height: 38px;
`

const Select = styled.select`
  ${fontSize};
  appearance: none;
  background: transparent;
  border: none;
  height: 100%;
`

const Selector = (props: selectorProps) => (
  <Wrapper onChange={props.onChange} {...props}>
    <Select {...props}>
      {props.list.map((row, i) => (
        <option key={i} value={row.label}>
          {row.label}
        </option>
      ))}
    </Select>
    <Icon glyph={'arrow-down'} size={20} verticalAlign={'middle'} />
  </Wrapper>
)

Selector.defaultProps = {
  className: 'selector',
  color: theme.colors.black,
  borderRadius: 1,
  bg: 'white',
  px: 2,
  fontSize: 2,
}

export default Selector
