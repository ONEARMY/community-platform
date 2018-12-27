import * as React from 'react'

export class NotFoundPage extends React.Component {
  public render() {
    return (
      <div
        style={{
          flex: 1,
          marginTop: '20vh',
          marginRight: 'auto',
          marginLeft: 'auto',
          width: '220px',
          textAlign: 'center',
        }}
      >
        <div style={{ marginBottom: '2em', fontSize: 'x-large' }}>404</div>
        <div style={{ marginBottom: '2em' }}>
          The page you were looking for was moved or doesn't exist
        </div>
        <a href="/">Home</a>
      </div>
    )
  }
}
