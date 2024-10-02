import { CardButton } from '../CardButton/CardButton'

interface IProps {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}

export const MapFilterListItem = ({ active, onClick, children }: IProps) => {
  return (
    <CardButton
      data-cy={`MapFilterListItem${active ? '-active' : ''}`}
      onClick={onClick}
      extrastyles={{
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: 'offWhite',
        padding: 1,
        alignItems: 'center',
        gap: 2,
        ...(active
          ? {
              borderColor: 'green',
              ':hover': { borderColor: 'green' },
            }
          : {
              borderColor: 'offWhite',
              ':hover': { borderColor: 'offWhite' },
            }),
      }}
    >
      {children}
    </CardButton>
  )
}
