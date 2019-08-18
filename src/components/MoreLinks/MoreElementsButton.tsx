import React from 'react'
import { Link } from 'src/components/Links'
import { Flex, Text, Button } from 'rebass'
import styled from 'styled-components'

interface IProps {
  buttonLink: string
  buttonVariant: string
  buttonLabel: string
}

export class MoreModal extends React.Component<IProps> {
  constructor(props: any) {
    super(props)
  }
  render() {
    return (
      <>
        <Flex justifyContent={'center'} mt={20}>
          <Link to={this.props.buttonLink}>
            <Button variant={this.props.buttonVariant}>
              {this.props.buttonLabel}
            </Button>
          </Link>
        </Flex>
      </>
    )
  }
}

export default MoreModal
