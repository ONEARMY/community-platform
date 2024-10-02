import { Card } from 'theme-ui'

import type { BoxProps, ThemeUIStyleObject } from 'theme-ui'

export interface IProps extends BoxProps {
  children: React.ReactNode
  extrastyles?: ThemeUIStyleObject | undefined
}

export const CardButton = (props: IProps) => {
  const { children, extrastyles } = props

  return (
    <Card
      sx={{
        alignItems: 'center',
        alignContent: 'center',
        marginTop: '2px',
        borderRadius: 2,
        padding: 0,
        transition: 'borderBottom 0.2s, transform 0.2s',
        '&:hover': {
          animationSpeed: '0.3s',
          cursor: 'pointer',
          marginTop: '0',
          borderBottom: '4px solid',
          transform: 'translateY(-2px)',
          borderColor: 'black',
        },
        '&:active': {
          transform: 'translateY(1px)',
          borderBottom: '3px solid',
          borderColor: 'grey',
          transition: 'borderBottom 0.2s, transform 0.2s, borderColor 0.2s',
        },
        ...extrastyles,
      }}
      {...props}
    >
      {children}
    </Card>
  )
}
