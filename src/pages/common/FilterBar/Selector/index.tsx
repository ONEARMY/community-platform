import * as React from 'react'

import { Select } from './elements'
import { PROJECTS_MOCKS } from 'src/mocks/projects.mock'
import { CATEGORY_MOCKS } from 'src/mocks/category.mock'
import { TAGS_MOCK } from 'src/mocks/tags.mock'

interface IProps {
  onChange: () => void
  type: string
}

export default class Selector extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props)
  }

  render() {
    return (
      <span>
        <Select
          name={this.props.type}
          component="select"
          onChange={this.props.onChange}
        >
          {this.props.type === 'project' &&
            PROJECTS_MOCKS.map((project, i) => (
              <option key={i} value={project.value}>
                {project.name}
              </option>
            ))}
          {this.props.type === 'category' &&
            CATEGORY_MOCKS.map((category, i) => (
              <option key={i} value={category.label}>
                {category.label}
              </option>
            ))}
          {this.props.type === 'tags' &&
            TAGS_MOCK.map((tag, i) => (
              <option key={i} value={tag.label}>
                {tag.label}
              </option>
            ))}
        </Select>
      </span>
    )
  }
}
