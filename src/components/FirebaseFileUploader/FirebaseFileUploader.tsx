import * as React from 'react'
import { storage } from '../../utils/firebase'
import FileUploader from 'react-firebase-file-uploader'
import { FullMetadata } from '@firebase/storage-types'
import { Button } from 'oa-components'
import type { IGlyphs } from 'oa-components'
import { Flex } from 'rebass'
import Loader from '../Loader'
import { logger } from 'src/logger'
/*
This component takes a folder storage path and uploads files to firebase storage
onUploadSucess allows URLs of completed uploads to be passed back to parent component
additional optional fields are a subset of https://www.npmjs.com/package/react-firebase-file-uploader
*/
interface IProps {
  storagePath: string
  onUploadSuccess: (fileInfo: IFirebaseUploadInfo, callBackData?: any) => void
  callbackData?: any
  buttonText?: string
  accept?: string
  name?: string
  hidden?: boolean
  icon?: keyof IGlyphs
}
interface IState {
  isUploading: boolean
  uploadProgress: number
}
export interface IFirebaseUploadInfo {
  downloadUrl: string
  contentType?: string | null
  fullPath: string
  name: string
  size: number
  timeCreated: string
  updated: string
}

export class FirebaseFileUploader extends React.Component<IProps, IState> {
  public static defaultProps: any
  public fileInputRef: any

  constructor(props: any) {
    super(props)
    this.state = {
      isUploading: false,
      uploadProgress: 0,
    }
  }

  public handleUploadStart = () => {
    this.setState({ isUploading: true, uploadProgress: 0 })
  }
  public handleProgress = (progress: any) => {
    this.setState({ uploadProgress: progress })
  }
  public handleUploadError = (error: any) => {
    this.setState({ isUploading: false })
    console.error(error)
  }
  // on success update progress and pass back complete url to parent component
  public handleUploadSuccess = async (filename: string) => {
    const meta: FullMetadata = await storage
      .ref(this.props.storagePath)
      .child(filename)
      .getMetadata()
    const url = await storage
      .ref(this.props.storagePath)
      .child(filename)
      .getDownloadURL()
    const fileInfo: IFirebaseUploadInfo = {
      downloadUrl: url,
      contentType: meta.contentType,
      fullPath: meta.fullPath,
      name: meta.name,
      size: meta.size,
      timeCreated: meta.timeCreated,
      updated: meta.updated,
    }
    return this.props.onUploadSuccess(fileInfo, this.props.callbackData)
  }

  public deleteUploads = async (fileInfo?: any) => {
    // WiP
    logger.warn('TODO - handle delete', fileInfo)
  }

  // the first styled button in our template intercepts all click events so we have a manual method
  // to trigger the second click
  public triggerFileUploaderClick() {
    const divRef: HTMLElement = this.fileInputRef

    const inputRef = divRef.querySelector('input') as HTMLInputElement
    inputRef.click()
  }

  public renderProgressBar() {
    if (this.state.isUploading) {
      if (this.state.uploadProgress > 0) {
        return <Loader />
      }
      return <Loader />
    } else {
      return null
    }
  }

  public render() {
    return (
      <>
        <Button
          icon={this.props.icon}
          onClick={() => this.triggerFileUploaderClick()}
          type="button"
          variant="light"
        >
          {this.props.buttonText}
          <div ref={(input: any) => (this.fileInputRef = input)}>
            <FileUploader
              hidden
              accept={this.props.accept}
              name="fileUploader"
              storageRef={storage.ref(this.props.storagePath)}
              onUploadStart={this.handleUploadStart}
              onUploadError={this.handleUploadError}
              onUploadSuccess={this.handleUploadSuccess}
              onProgress={this.handleProgress}
            />
          </div>
        </Button>
        <Flex p={0} mt={3}>
          {this.renderProgressBar()}
        </Flex>
      </>
    )
  }
}

FirebaseFileUploader.defaultProps = {
  buttonText: 'Upload',
  accept: '*',
}
