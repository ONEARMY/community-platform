import * as React from 'react'
import { storage } from '../../../utils/firebase'
import FileUploader from 'react-firebase-file-uploader'
import LinearProgress from '@material-ui/core/LinearProgress'
import Button from '@material-ui/core/Button'
import UploadIconImage from '../../../assets/icons/upload.svg'
import './FirebaseFileUploader.scss'
import { FullMetadata } from '@firebase/storage-types'
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

const styles = {
  icon: {
    marginLeft: '8px',
    height: '1.5em',
  },
  container: {
    width: '100%',
    margin: '1em 0',
  },
  button: {
    width: '100%',
  },
  progressContainer: {
    height: 5,
    MarginTop: 5,
  },
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
          <LinearProgress
            variant="determinate"
            value={this.state.uploadProgress}
            className={
              this.state.uploadProgress === 100
                ? 'progress-bar--complete'
                : 'progress-bar--uploading'
            }
          />
        )
      }
      return <LinearProgress />
    } else {
      return null
    }
  }

  public render() {
    return (
      <div style={styles.container}>
        <Button
          variant="outlined"
          color="default"
          style={styles.button}
          onClick={() => this.triggerFileUploaderClick()}
        >
          <div>
            <div>
              {this.props.buttonText}
              <img src={UploadIconImage} alt="" style={styles.icon} />
            </div>
            <div style={styles.progressContainer}>
              {this.renderProgressBar()}
            </div>
          </div>

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
      </div>
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
