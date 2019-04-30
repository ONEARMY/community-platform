import * as React from 'react'

interface IProps {
  file: File
}
interface IState {}
export class FileInfo extends React.Component<IProps, IState> {
  render() {
    const { file } = this.props
    return <div>{file.name}</div>
  }
}
