import { Button } from '../Button/Button'

interface IProps {
  children: React.ReactNode
  itemColor: string
  onClick: () => void
}

export const FollowResearchButton = ({
  children,
  itemColor,
  onClick,
}: IProps) => {
  return (
    <Button
      data-testid="follow-button"
      data-cy="follow-button"
      data-tip={'Login to follow'}
      icon="thunderbolt"
      variant="outline"
      iconColor={itemColor}
      sx={{
        fontSize: 2,
        py: 0,
        height: '41.5px', // TODO: Ideally this is a standard size
      }}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}
