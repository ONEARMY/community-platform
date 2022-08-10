import * as React from 'react'
import errorImage from '../../assets/images/404error.png'
import { Box, Image } from 'theme-ui'
import { Link } from 'react-router-dom'

export class NotFoundPage extends React.Component {
  public render() {
    return (
      <Box
        sx={{
          flex: 1,
          marginTop: 4,
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <Image
          src={errorImage}
          sx={{
            maxWidth: '45em',
            width: '98%',
            marginBottom: '2vw',
          }}
        />
        <div style={{ marginBottom: '2em' }}>Nada, page not found 💩</div>
        Go to the <Link to="/">home page</Link>
      </Box>
    )
  }
}
