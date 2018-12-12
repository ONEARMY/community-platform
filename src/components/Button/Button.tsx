import React from 'react'
import { MdFileDownload, MdAdd, MdCheck, MdFileUpload } from 'react-icons/md'
import {
  AddTutBtn,
  AddStepBtn,
  SaveTutBtn,
  LoadButton,
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
      <LoadButton {...props}>
        <Container>
          <MdFileDownload style={iconStyle} />
          <InnerButtonText>{props.text}</InnerButtonText>
        </Container>
      </LoadButton>
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

  if (props.upload) {
    return (
      <LoadButton {...props}>
        <MdFileUpload style={iconStyle} />
        <InnerButtonText>{props.text}</InnerButtonText>
        {props.children}
      </LoadButton>
    )
  }

  return <Button {...props} />
}

export default ButtonComponent
