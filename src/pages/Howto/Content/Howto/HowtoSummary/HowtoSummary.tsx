import React from 'react'
import List from '@material-ui/core/List'
import { HashLink } from 'react-router-hash-link'

import { Container } from './elements'
import { IHowtoStep } from 'src/models/howto.models'
import { ListItem } from '@material-ui/core'

interface IProps {
  steps: IHowtoStep[]
  slug: string
}

export default class HowtoSummary extends React.PureComponent<IProps> {
  render() {
    return (
      <Container>
        <List>
          <ListItem key={`intro`}>
            <HashLink to={`/how-to/${this.props.slug}`}>Introduction</HashLink>
          </ListItem>
          {this.props.steps.map((step: any, index: number) => {
            return (
              <ListItem key={index}>
                <HashLink
                  smooth
                  to={`/how-to/${this.props.slug}#${step.title}`}
                >
                  {step.title}
                </HashLink>
              </ListItem>
            )
          })}
        </List>
      </Container>
    )
  }
}
