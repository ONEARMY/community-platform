import * as React from 'react'
import './UploadedFile.scss'
import { Button } from 'src/components/Button'
import Icon from 'src/components/Icons'

interface IProps {
  imageSrc: string
  imageAlt: string
  showDelete: boolean
  onDelete: () => void
}

interface IState {
  imageLoaded: boolean
}

export default class ImagePreview extends React.Component<IProps, IState> {
  public state: IState = {
    imageLoaded: false,
  }

  public imageLoaded = () => {
    this.setState({ imageLoaded: true })
  }

  public render() {
    return (
      <div className="img-preview__container">
        <img
          className={`img-preview__image ${this.state.imageLoaded &&
            'loaded'} `}
          src={this.props.imageSrc}
          alt={this.props.imageAlt}
          onLoad={this.imageLoaded}
          crossOrigin=""
        />
        {this.props.showDelete ? (
          <Button className="img-preview__delete" onClick={this.props.onDelete}>
            <Icon glyph={'close'} />
          </Button>
        ) : null}
      </div>
    )
  }
}
