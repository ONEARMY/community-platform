import { Banner } from 'oa-components'

interface IProps {
  onClick: () => void
  text: string
}

export const NewMapBanner = (props: IProps) => {
  const { onClick, text } = props
  return (
    <Banner
      onClick={onClick}
      variant="accent"
      sx={{ display: ['none', 'none', 'none', 'inherit'] }}
    >
      {text}
    </Banner>
  )
}
