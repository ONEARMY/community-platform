import { Text } from 'theme-ui'
import { Button } from '..'

export interface IProps {
  viewsCount: number 
}

export const ViewsCounter = (props: IProps) => {
  
  return (
    <>
      <Button
        data-cy="viewsCounter"
        variant="subtle"
        sx={{
          backgroundColor: 'transparent',
          fontSize: 2,
          ml: 2,
          background: 'softyellow',
          borderColor: 'softyellow',
          opacity: 1,
          pointerEvents: 'none',
          cursor: 'none'
        }}
        icon={'star'}
      >
        <Text ml={-1}> 
        {props.viewsCount}
        {props.viewsCount !== 1 ? ' views' : ' view'}
        </Text>
      </Button>
    </>
  )
}
