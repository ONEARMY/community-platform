import * as React from 'react'
import { IFirebaseUploadInfo } from 'src/components/FirebaseFileUploader/FirebaseFileUploader'
import { storage } from 'src/utils/firebase'
import './UploadedFile.scss'
import { Button } from 'src/components/Button'
import Icon from 'src/components/Icons'
import ImagePreview from './ImagePreview'
import { logger } from 'src/logger'

/*************************************************************************
 * Component to display a file that has been uploaded to firebase storage,
 * providing image preview, download links and delete
 ************************************************************************/

interface IUploadedFileProps {
  file: IFirebaseUploadInfo
  imagePreview: boolean
  showDelete: boolean
  onFileDeleted: () => void
}

interface IState {
  deleted: boolean
}

export class UploadedFile extends React.Component<IUploadedFileProps, IState> {
  public static defaultProps: Partial<IUploadedFileProps>
  constructor(props: any) {
    super(props)
    this.state = { deleted: false }
  }

  // remove the file from storage repository
  public delete = () => {
    const ref = storage.ref(this.props.file.fullPath)
    // return callback before confirmation of deletion to provide immediate feedback to user
    this.props.onFileDeleted()
    this.setState({ deleted: true })
    ref.delete().catch(error => {
      throw new Error(JSON.stringify(error))
    })
  }

  public render() {
    const { file, imagePreview, showDelete } = this.props
    const formattedSize = this.convertFileSize(file.size, 2)
    return (
      // apply transition on first load
      <div className="uploaded-file">
        {imagePreview ? (
          <ImagePreview
            imageSrc={file.downloadUrl}
            imageAlt={'cover image - ' + file.name}
            onDelete={this.delete}
            showDelete={showDelete}
          />
        ) : (
          // file display
          <div className="file-meta__container">
            <div className="file-meta__name">
              <a
                download
                target="_blank"
                href={file.downloadUrl}
                rel="noreferrer"
              >
                {file.name}
              </a>
            </div>
            <div className="file-meta__size">{formattedSize}</div>
            {showDelete ? (
              <Button
                className="file-meta__delete"
                onClick={() => {
                  this.delete()
                }}
              >
                <Icon glyph={'delete'} />
              </Button>
            ) : null}
          </div>
        )}
      </div>
    )
  }

  private convertFileSize(bytes: number, decimals: number) {
    if (bytes === 0) {
      return '0 Bytes'
    }
    const k = 1024
    const dm = decimals <= 0 ? 0 : decimals || 2
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    const formatted =
      parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
    return formatted
  }
}

UploadedFile.defaultProps = {
  onFileDeleted: () => logger.debug('file deleted'),
  imagePreview: false,
  showDelete: false,
}
