import { useContext } from 'react'
import { VisibilityContext } from 'react-horizontal-scrolling-menu'
import { Flex } from 'theme-ui'

import { Icon } from '../Icon/Icon'

import type { publicApiType } from 'react-horizontal-scrolling-menu'
import type { availableGlyphs } from '../Icon/types'

import './styles.css'

interface IProps {
  disabled: boolean
  glyph: availableGlyphs
  onClick: () => void
}

const Arrow = ({ disabled, glyph, onClick }: IProps) => {
  const start = glyph === 'chevron-right' ? 0 : 1
  const end = glyph === 'chevron-right' ? 1 : 0
  const background = `linear-gradient(to right, rgba(255, 255, 255, ${start}) 0%, rgba(255, 255, 255, ${end}) 100%)`

  return (
    <Flex
      sx={{
        width: '35px',
        overflow: 'hidden',
        alignItems: 'center',
        borderRadius: 2,
        ':hover': !disabled ? { background } : {},
        ':active': !disabled ? { backgroundColor: 'white' } : {},
      }}
    >
      {disabled ? null : (
        <Icon glyph={glyph}  size={40} onClick={onClick} className="arrow-" />
      )}
    </Flex>
  )
}

export const LeftArrow = () => {
  const visibility = useContext<publicApiType>(VisibilityContext)
  const disabled = visibility.useLeftArrowVisible()
  const onClick = () =>
    visibility.scrollToItem(visibility.getPrevElement(), 'smooth', 'start')

  return <Arrow disabled={disabled} glyph="chevron-left" onClick={onClick} />
}

export const RightArrow = () => {
  const visibility = useContext<publicApiType>(VisibilityContext)
  const disabled = visibility.useRightArrowVisible()
  const onClick = () =>
    visibility.scrollToItem(visibility.getNextElement(), 'smooth', 'end')

  return <Arrow disabled={disabled} glyph="chevron-right" onClick={onClick} />
}
