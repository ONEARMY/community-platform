import * as React from 'react'
import Uppy from '@uppy/core'
import { DashboardModal } from '@uppy/react'
import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'
import { Button } from '../Button'
import { UPPY_CONFIG } from './UppyConfig'

interface IUppyFiles {
  [key: string]: Uppy.UppyFile<{}>
}
interface IProps {
  onFilesChange?: (files: (Blob | File)[]) => void
}
interface IState {
  open: boolean
}
export class FileInput extends React.Component<IProps, IState> {
  private uppy = Uppy({
    ...UPPY_CONFIG,
    onBeforeUpload: () => this.uploadTriggered(),
  })
  constructor(props: IProps) {
    super(props)
    this.state = { open: false }
  }
  get files() {
    const files = this.uppy.getState().files as IUppyFiles
    return files
  }

  handleClose() {
    this.setState({
      open: false,
    })
    this.triggerCallback()
  }
  uploadTriggered() {
    this.handleClose()
    return this.files
  }
  triggerCallback() {
    const fileArray = Object.values(this.files).map(meta => meta.data)
    if (this.props.onFilesChange) {
      this.props.onFilesChange(fileArray)
    }
  }

  render() {
    return (
      <>
        <Button
          icon="upload"
          onClick={() => this.setState({ open: true })}
          type="button"
          variant="light"
        >
          Upload Files
        </Button>
        <DashboardModal
          uppy={this.uppy}
          open={this.state.open}
          onRequestClose={() => this.handleClose()}
        />
      </>
    )
  }
}
