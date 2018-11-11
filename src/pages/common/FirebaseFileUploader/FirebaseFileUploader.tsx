import * as React from 'react'
import { storage } from '../../../utils/firebase'
import FileUploader from 'react-firebase-file-uploader'
import LinearProgress from '@material-ui/core/LinearProgress'
import Button from '@material-ui/core/Button'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import UploadIconImage from '../../../assets/icons/upload.svg'

interface IProps {
  storagePath: string
  onUploadSuccess: (url: string) => void
  buttonText?: string
  accept?: string
  name?: string
  hidden?: boolean
}
interface IState {
  isUploading: boolean
  uploadProgress: number
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
  public handleProgress = (imgUploadProgress: any) => {
    this.setState({ uploadProgress: imgUploadProgress })
  }
  public handleUploadError = (error: any) => {
    this.setState({ isUploading: false })
    console.error(error)
  }
  // on success update progress and pass back complete url to parent component
  public handleUploadSuccess = async (filename: string) => {
    console.log('upload success')
    this.setState({
      uploadProgress: 100,
      isUploading: false,
    })
    const url = await storage
      .ref(this.props.storagePath)
      .child(filename)
      .getDownloadURL()
    return this.props.onUploadSuccess(url)
  }

  // the first styled button in our template intercepts all click events so we have a manual method
  // to trigger the second click
  public triggerFileUploaderClick() {
    const divRef: HTMLElement = this.fileInputRef
    const inputRef = divRef.querySelector('input') as HTMLInputElement
    inputRef.click()
  }

  public render() {
    //
    return (
      <div style={styles.container}>
        <Button
          variant="outlined"
          color="default"
          style={styles.button}
          onClick={() => this.triggerFileUploaderClick()}
        >
          {this.props.buttonText}
          {/* <CloudUploadIcon style={styles.icon} /> */}
          <img src={UploadIconImage} alt="" style={styles.icon} />
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

          {this.state.isUploading && this.state.uploadProgress === 0 ? (
            <LinearProgress />
          ) : (
            <LinearProgress
              variant="determinate"
              value={this.state.uploadProgress}
            />
          )}
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
