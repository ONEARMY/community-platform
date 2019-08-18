import React from 'react'
import { Link } from 'src/components/Links'
import { Flex, Text, Button } from 'rebass'
import styled from 'styled-components'
import theme from 'src/themes/styled.preciousplastic'

interface IProps {
  pageTitle: string
}

const HeadingListPage = styled.h1`
  ${theme.titles.ListPage}
`

export class ListPageTitle extends React.Component<IProps> {
  constructor(props: any) {
    super(props)
  }
  render() {
    return (
      <>
        <Flex py={26}>
          <HeadingListPage>{this.props.pageTitle}</HeadingListPage>
        </Flex>
      </>
    )
  }
}

export default ListPageTitle
