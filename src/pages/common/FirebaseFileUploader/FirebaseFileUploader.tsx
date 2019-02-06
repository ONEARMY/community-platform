import * as React from 'react'
import { storage } from '../../../utils/firebase'
import FileUploader from 'react-firebase-file-uploader'
import { FullMetadata } from '@firebase/storage-types'
import {
  Container,
  ProgressContainer,
  ProgressBar,
  UploadBtn,
} from './elements'
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
        return (
          <ProgressBar
            variant="determinate"
            value={this.state.uploadProgress}
            progress={this.state.uploadProgress}
          />
        )
      }
      return <ProgressBar />
    } else {
      return null
    }
  }

  public render() {
    return (
      <Container>
        <UploadBtn
          icon={'upload'}
          onClick={() => this.triggerFileUploaderClick()}
          type="button"
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
        </UploadBtn>
        <ProgressContainer>{this.renderProgressBar()}</ProgressContainer>
      </Container>
    )
  }
}

FirebaseFileUploader.defaultProps = {
  buttonText: 'Upload',
  accept: '*',
}

/*
From old component:

// TODO For now using the onChange method stop the upload
// Need to start upload manually, to be able to check file size
// see this issue https://github.com/fris-fruitig/react-firebase-file-uploader/issues/4#issuecomment-277352083
onChange={(e: any) => {
// if there is no file and size is bigger than 20mb
if (
  e.target.files[0] !== undefined &&
  e.target.files[0].size > 20971520
) {
  alert(
    'Your file is too big, maximum allowed size is 20mb',
  )
  e.target.value = ''
} else {
  // display file name
  const el = document.getElementsByClassName(
    'uploaded-file-name',
  )[0]
  el.innerHTML = e.target.files[0].name
}
}}


*/
