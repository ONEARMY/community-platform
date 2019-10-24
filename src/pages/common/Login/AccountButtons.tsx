import React from 'react'
import theme from 'src/themes/styled.theme'
import styled from 'styled-components'
import { Flex } from 'rebass'
import { Box } from 'rebass'
import { Link } from 'src/components/Links'
import { Button } from 'src/components/Button'
import { display, DisplayProps } from 'styled-system'

const ButtonSign = styled(Button)<DisplayProps>`
  ${display}
`
interface IProps {
  link: string
  text: string
  variant: string
  style?: React.CSSProperties
  isMobile?: boolean
}

export class AccountButtons extends React.Component<IProps> {
  render() {
    return (
      <>
        <Link to={this.props.link}>
          <ButtonSign
            variant={this.props.variant}
            display={
              this.props.isMobile === true
                ? ['flex', 'flex', 'none']
                : ['none', 'none', 'flex']
            }
            {...(this.props.isMobile === true
              ? { small: true }
              : { medium: true })}
            data-cy={this.props.text.toLowerCase()}
            style={this.props.style}
          >
            {this.props.text}
          </ButtonSign>
        </Link>
      </>
    )
  }
}

export default AccountButtons
