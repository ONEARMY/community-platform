import * as React from 'react'

import { PROJECTS_MOCKS } from 'src/mocks/projects.mock'
import { CATEGORY_MOCKS } from 'src/mocks/category.mock'
import { TAGS_MOCK } from 'src/mocks/tags.mock'

import { Box, Flex } from 'rebass'
import { Button } from 'oa-components'
import Selector from 'src/components/Selector'
import { Link } from 'react-router-dom'
import { logger } from 'src/logger'

interface IProps {
  onChange: () => void
  section: string
}

export default class FilterBar extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props)
  }
  public onProjectChange() {
    logger.debug('project changed')
    this.props.onChange()
  }

  public onCategoryChange() {
    logger.debug('onCategoryChange')
    this.props.onChange()
  }

  public onTagsChange() {
    logger.debug('onTagsChange')
    this.props.onChange()
  }

  render() {
    const { section } = this.props
    return (
      <Flex justifyContent={'space-between'} mb={4}>
        <Box>
          <Selector
            onChange={() => this.onProjectChange()}
            list={PROJECTS_MOCKS}
          />
          <Selector
            onChange={() => this.onCategoryChange()}
            list={CATEGORY_MOCKS}
          />
          <Selector onChange={() => this.onTagsChange()} list={TAGS_MOCK} />
        </Box>
        <Box>
          <Link to={section + '/create'}>
            <Button variant="outline">create {section}</Button>
          </Link>
        </Box>
      </Flex>
    )
  }
}
