import { Flex } from 'theme-ui'

import { Icon } from '../Icon/Icon'

import type { availableGlyphs } from '../Icon/types'

import './styles.css'

interface IProps {
  disabled?: boolean
  glyph: availableGlyphs
  onClick?: () => void
}

export const Arrow = ({ disabled, glyph, onClick }: IProps) => {
  return (
    <Flex
      sx={{
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: glyph === 'chevron-right' ? 'flex-start' : 'flex-end',
      }}
    >
      {disabled ? null : (
        <Flex
          sx={{
            width: '45px',
            height: '45px',
            marginRight: glyph === 'chevron-right' ? '10px' : '0px',
            marginLeft: glyph === 'chevron-right' ? '0px' : '10px',
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
              left: glyph === 'chevron-right' ? '1px' : '-1px',
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
