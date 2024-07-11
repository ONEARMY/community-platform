import { Button } from 'oa-components'
import { Flex } from 'theme-ui'

import type { BoxProps, ThemeUIStyleObject } from 'theme-ui'

const alignCenterWrapperStyles: ThemeUIStyleObject = {
  height: '100%',
  width: '100%',
  overflow: 'hidden',
  justifyContent: 'center',
  alignItems: 'center',
}

const UploadImageOverlay = (props: BoxProps): JSX.Element => (
  <Flex
    sx={{
      ...alignCenterWrapperStyles,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      opacity: 0,
      visibility: 'hidden',
      transition: 'opacity 300ms ease-in',
      borderRadius: 3,
      '.image-input__wrapper:hover &': {
        visibility: 'visible',
        opacity: 1,
      },
    }}
  >
    {props.children}
  </Flex>
)

interface IProps {
  onClick: (event: Event) => void
}

export const DeleteImage = ({ onClick }: IProps) => {
  return (
    <UploadImageOverlay>
      <Button
        data-cy="delete-image"
        data-testid="delete-image"
        small
        variant="secondary"
        icon="delete"
        type="button"
        onClick={(event) => onClick(event)}
      >
        Delete
      </Button>
    </UploadImageOverlay>
  )
}
