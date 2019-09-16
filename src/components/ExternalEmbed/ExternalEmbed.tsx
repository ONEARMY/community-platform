import * as React from 'react'

interface IProps {
  src: string
}

export class ExternalEmbed extends React.Component<IProps> {
  render() {
    return (
      <div
        style={{
          position: 'relative',
          height: '100%',
        }}
      >
        <iframe
          src={this.props.src}
          style={{
            border: 0,
            height: '100%',
            width: '100%',
          }}
        />
      </div>
    )
  }
}
