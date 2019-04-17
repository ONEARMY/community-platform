import React from 'react'
import List from '@material-ui/core/List'
import { HashLink } from 'react-router-hash-link'

import { Container, SummaryListItem } from './elements'
import { IHowtoStep } from 'src/models/howto.models'
import { ListItem, ListItemText } from '@material-ui/core'

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
                <SummaryListItem variant="subtitle1">
                  Introduction
                </SummaryListItem>
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
                    <SummaryListItem variant="subtitle1">
                      {step.title}
                    </SummaryListItem>
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
