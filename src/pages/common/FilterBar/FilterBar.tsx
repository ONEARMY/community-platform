import * as React from 'react'

import { Container, CreateBtn, LinkToCreate } from './elements'
import Selector from './Selector'

interface IProps {
  onChange: () => void
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
    return (
      <Container>
        <Selector type="project" onChange={() => this.onProjectChange()} />
        <Selector type="category" onChange={() => this.onCategoryChange()} />
        <Selector type="tags" onChange={() => this.onTagsChange()} />
        {/* <Button
          to={`/post/create`}
          addcontent="true"
          text={'create discussion'}
          style={{ display: 'inherit', float: 'right', margin: '25px' }}
        /> */}
        <LinkToCreate to={'discussions/create'}>
          <CreateBtn icon={'add'}>create discussion</CreateBtn>
        </LinkToCreate>
      </Container>
    )
  }
}
