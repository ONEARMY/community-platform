import 'flag-icons/css/flag-icons.min.css'
import { Box } from 'theme-ui'

interface IProps {
  code: string
}

export const FlagIcon = (props: IProps) => {
  const { code } = props
  return (
    <Box
      className={`fi fi-${code}`}
      sx={{
        borderRadius: `3px`,
      }}
    />
  )
}
