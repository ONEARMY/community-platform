import * as React from 'react'

import { ISelectorList } from 'src/models/selectorList.models'

import styled from 'styled-components'
import { colors } from 'src/themes/styled.theme'
import {
  color,
  borderRadius,
  BorderRadiusProps,
  space,
  SpaceProps,
  fontSize,
} from 'styled-system'

import Icon from 'src/components/Icons'

interface IProps {
  onChange: () => void
  list: ISelectorList[]
}
type selectorProps = IProps & BorderRadiusProps & SpaceProps

const Wrapper = styled.div`
  ${color};
  ${borderRadius};
  ${space};
  border: 1px solid ${colors.grey};
  display: inline-block;
  height: 50px;
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
  color: colors.black,
  borderRadius: 2,
  bg: 'white',
  px: 2,
  my: 0,
  mx: 2,
  fontSize: 2,
}

export default Selector
