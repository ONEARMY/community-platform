import ReactPlayer from 'react-player/lazy'
import { Box } from 'theme-ui'

export interface Props {
  videoUrl: string
}

export const VideoPlayer = ({ videoUrl }: Props) => {
  return (
    <Box data-testid="VideoPlayer">
      <ReactPlayer width="auto" controls url={videoUrl} />
    </Box>
  )
}
