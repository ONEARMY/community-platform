import React from 'react'
import {
  LinkButton,
  AButton,
  DownloadButton,
  Button,
  DownloadIcon,
  InnerButtonText,
  Container,
} from './elements'

function ButtonComponent({ ...props }) {
  // Link
  if (props.to) {
    return <LinkButton {...props} />
  }

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

  return <Button {...props} />
}

export default ButtonComponent
