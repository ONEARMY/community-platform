import * as React from 'react'

import { Box, Flex } from 'rebass'
import { Button } from 'src/components/Button'
import Selector from 'src/components/Selector'
import Link from 'react-router-dom/Link'
import { FlexContainer } from 'src/components/Layout/FlexContainer'

interface IProps {
  onChange: () => void
  section: string
}

export default class FilterBar extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props)
  }

  public componentDidUpdate(prevProps: IProps) {
    // component updated
  }
  public onProjectChange() {
    console.log('project changed')
    this.props.onChange()
  }

  public onCategoryChange() {
    console.log('onCategoryChange')
    this.props.onChange()
  }

  public onTagsChange() {
    console.log('onTagsChange')
    this.props.onChange()
  }

  render() {
    const { section } = this.props
    return (
      <FlexContainer justifyContent={'space-between'}>
        <Box>
          <Selector type="project" onChange={() => this.onProjectChange()} />
          <Selector type="category" onChange={() => this.onCategoryChange()} />
          <Selector type="tags" onChange={() => this.onTagsChange()} />
        </Box>
        <Box>
          <Link to={section + '/create'}>
            <Button variant="outline">create {section}</Button>
          </Link>
        </Box>
      </FlexContainer>
    )
  }
}
