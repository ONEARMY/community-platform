import * as React from 'react'
import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'
import Uppy, { UppyFile } from '@uppy/core'
import { DashboardModal } from '@uppy/react'
import { Button } from 'oa-components'
import { UPPY_CONFIG } from './UppyConfig'
import { Flex } from 'rebass'
import { FileInfo } from '../FileInfo/FileInfo'

interface IUppyFiles {
  [key: string]: UppyFile
}
interface IProps {
  onFilesChange?: (files: (Blob | File)[]) => void
}
interface IState {
  open: boolean
}
export class FileInput extends React.Component<IProps, IState> {
  private uppy = new Uppy({
    ...UPPY_CONFIG,
    onBeforeUpload: () => this.uploadTriggered(),
  })
  constructor(props: IProps) {
    super(props)
    this.state = { open: false }
  }

  componentWillUnmount() {
    this.uppy.close()
  }
  get files() {
    const files = this.uppy.getState().files as IUppyFiles
    return files
  }
  get filesArray() {
    return Object.values(this.files).map(meta => meta.data) as File[]
  }

  // when upload button clicked just want to clise modal and reflect files
  uploadTriggered() {
    this.toggleModal()
    return this.files
  }

  toggleModal() {
    this.setState({
      open: !this.state.open,
    })
    this.triggerCallback()
  }
  // reflect changes to current files whenever modal open or closed
  triggerCallback() {
    if (this.props.onFilesChange) {
      this.props.onFilesChange(this.filesArray)
    }
  }
  // TODO - split into own component
  renderFilePreview(file: File) {
    return <div key={file.name}>{file.name}</div>
  }

  render() {
    const showFileList = this.filesArray.length > 0
    return (
      <>
        <Flex flexDirection="column" justifyContent="center">
          {showFileList ? (
            <>
              <Button
                onClick={() => this.toggleModal()}
                icon="upload"
                variant="outline"
                mb={1}
              >
                Add Files (.zip)
              </Button>
              {this.filesArray.map(file => (
                <FileInfo key={file.name} file={file} />
              ))}
            </>
          ) : (
            <Button
              icon="upload"
              onClick={() => this.toggleModal()}
              type="button"
              variant="outline"
            >
              Upload Files (.zip)
            </Button>
          )}
          <DashboardModal
            proudlyDisplayPoweredByUppy={false}
            uppy={this.uppy}
            open={this.state.open}
            closeModalOnClickOutside
            onRequestClose={() => this.toggleModal()}
          />
        </Flex>
      </>
    )
  }
}
