import React from 'react'
// TODO remove material-ui from here
import List from '@material-ui/core/List'
import { HashLink } from 'react-router-hash-link'

import { Container } from './elements'
import { IHowtoStep } from 'src/models/howto.models'
import { ListItem, ListItemText } from '@material-ui/core'
import Text from 'src/components/Text'

interface IProps {
  steps: IHowtoStep[]
  howToSlug: string
}

export default class HowtoSummary extends React.PureComponent<IProps> {
  render() {
    return (
      <Container>
        <List>
          <ListItem key={`intro`}>
            <HashLink
              smooth
              to={{
                pathname: `/how-to/${this.props.howToSlug}`,
                hash: '#description',
              }}
            >
              <ListItemText>
                <Text caps>Introduction</Text>
              </ListItemText>
            </HashLink>
          </ListItem>
          {this.props.steps.map((step: any, index: number) => {
            return (
              <ListItem key={index}>
                <HashLink
                  smooth
                  to={{
                    pathname: `/how-to/${this.props.howToSlug}`,
                    hash: `#${step.title}`,
                  }}
                >
                  <ListItemText>
                    <Text caps>{step.title}</Text>
                  </ListItemText>
                </HashLink>
              </ListItem>
            )
          })}
        </List>
      </Container>
    )
  }
}
