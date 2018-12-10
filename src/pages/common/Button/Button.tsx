import React from 'react'
import {
  LinkButton,
  AButton,
  DownloadButton,
  Button,
  DownloadIcon,
  InnerButtonText,
  Container,
  AddIcon,
} from './elements'

function ButtonComponent({ ...props }) {
  if (props.href && props.download) {
    return (
      <DownloadButton {...props}>
        <Container>
          <DownloadIcon />
          <InnerButtonText>{props.text}</InnerButtonText>
        </Container>
      </DownloadButton>
    )
  }
  if (props.to && props.btnfn === 'addtutorial') {
    return (
      <LinkButton {...props}>
        <Container>
          <AddIcon />
          <InnerButtonText>{props.text}</InnerButtonText>
        </Container>
      </LinkButton>
    )
  }

  return <Button {...props} />
}

export default ButtonComponent
