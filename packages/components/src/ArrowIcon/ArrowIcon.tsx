import { Flex } from 'theme-ui'

import { Icon } from '../Icon/Icon'

import type { availableGlyphs } from '../Icon/types'

import './styles.css'

interface IProps {
  disabled?: boolean
  direction: "left" | "right"
  onClick?: () => void
}

export const Arrow = ({ disabled, direction, onClick }: IProps) => {
  const glyph: availableGlyphs = direction === 'left' ? 'chevron-left' : 'chevron-right'
  return (
    <Flex
      sx={{
        overflow: 'hidden',
        alignItems: 'center',
      }}
    >
      {disabled ? null : (
        <Flex
          sx={{
            width: '45px',
            height: '45px',
            border: '3px solid #000',
            borderRadius: 3,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
          }}
        >
          <Icon
            sx={{
              position: 'relative',
              // Properly center the icon for arrows as they can look offset
              left: direction === 'right' ? '1px' : '-1px',
            }}
            glyph={glyph}
            size={35}
            onClick={onClick}
            className="arrow-"
          />
        </Flex>
      )}
    </Flex>
  )
}
