// As much as possible taken directly from https://asmyshlyaev177.github.io/react-horizontal-scrolling-menu/?path=/story/examples-simple--simple
// Generally only edited for readability

import React, { useContext } from 'react'
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu'
import styled from '@emotion/styled'
import { Box } from 'theme-ui'

import { Arrow } from '../ArrowIcon/ArrowIcon'

import type { publicApiType } from 'react-horizontal-scrolling-menu'

import 'react-horizontal-scrolling-menu/dist/styles.css'

export interface IProps {
  children: React.ReactElement[]
  dataCy?: string
}

export const LeftArrow = () => {
  const visibility = useContext<publicApiType>(VisibilityContext)
  const disabled = visibility.useLeftArrowVisible()
  const onClick = () =>
    visibility.scrollToItem(visibility.getPrevElement(), 'smooth', 'start')

  return (
    <Arrow
      disabled={disabled}
      direction="left"
      sx={{ marginLeft: '10px' }}
      onClick={onClick}
    />
  )
}

export const RightArrow = () => {
  const visibility = useContext<publicApiType>(VisibilityContext)
  const disabled = visibility.useRightArrowVisible()
  const onClick = () =>
    visibility.scrollToItem(visibility.getNextElement(), 'smooth', 'end')

  return (
    <Arrow
      disabled={disabled}
      direction="right"
      sx={{ marginRight: '10px' }}
      onClick={onClick}
    />
  )
}

export const VerticalList = ({ children, dataCy }: IProps) => {
  return (
    <Box data-cy={dataCy} sx={{ alignSelf: 'center', maxWidth: '100%' }}>
      <NoScrollbar>
        <ScrollMenu
          LeftArrow={LeftArrow}
          RightArrow={RightArrow}
          onWheel={onWheel}
        >
          {children}
        </ScrollMenu>
      </NoScrollbar>
    </Box>
  )
}

const NoScrollbar = styled('div')({
  '& .react-horizontal-scrolling-menu--scroll-container::-webkit-scrollbar': {
    display: 'none',
  },

  '& .react-horizontal-scrolling-menu--scroll-container': {
    display: 'flex',
    flexWrap: 'wrap',
    scrollbarWidth: 'none',
    '-ms-overflow-style': 'none',
  },
})

function onWheel(apiObj: publicApiType, ev: React.WheelEvent): void {
  // NOTE: no good standard way to distinguish touchpad scrolling gestures
  // but can assume that gesture will affect X axis, mouse scroll only Y axis
  // of if deltaY too small probably is it touchpad
  const isThouchpad = Math.abs(ev.deltaX) !== 0 || Math.abs(ev.deltaY) < 15

  if (isThouchpad) {
    ev.stopPropagation()
    return
  }

  if (ev.deltaY < 0) {
    apiObj.scrollNext()
  } else {
    apiObj.scrollPrev()
  }
}
