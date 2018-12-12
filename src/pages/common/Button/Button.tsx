import React from 'react'
import { MdFileDownload, MdAdd, MdCheck } from 'react-icons/md'
import {
  AddTutBtn,
  AddStepBtn,
  SaveTutBtn,
  DownloadButton,
  Button,
  InnerButtonText,
  Container,
} from './elements'

const iconStyle = {
  width: '25px',
  height: '25px',
}

function ButtonComponent({ ...props }) {
  if (props.href && props.download) {
    return (
      <DownloadButton {...props}>
        <Container>
          <MdFileDownload style={iconStyle} />
          <InnerButtonText>{props.text}</InnerButtonText>
        </Container>
      </DownloadButton>
    )
  }

  if (props.to && props.addtutorial) {
    return (
      <AddTutBtn {...props}>
        <Container>
          <MdAdd style={iconStyle} />
          <InnerButtonText>{props.text}</InnerButtonText>
        </Container>
      </AddTutBtn>
    )
  }

  if (props.addstep) {
    return (
      <AddStepBtn {...props}>
        <MdAdd style={iconStyle} />
        <InnerButtonText>{props.text}</InnerButtonText>
      </AddStepBtn>
    )
  }

  if (props.saveTut) {
    return (
      <SaveTutBtn {...props}>
        <MdCheck style={iconStyle} />
        <InnerButtonText>{props.text}</InnerButtonText>
      </SaveTutBtn>
    )
  }

  return <Button {...props} />
}

export default ButtonComponent
