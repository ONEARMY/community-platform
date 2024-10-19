import { useEffect, useRef, useState } from 'react'
import { Flex, Text } from 'theme-ui'

import { ButtonIcon } from '../ButtonIcon/ButtonIcon'
import { CardButton } from '../CardButton/CardButton'
import { MemberBadge } from '../MemberBadge/MemberBadge'

import type { ProfileTypeName } from 'oa-shared'

type FilterOption = {
  label: string
  type: ProfileTypeName
}

export interface IProps {
  activeFilters: string[]
  availableFilters: FilterOption[]
  onFilterChange: (label: string) => void
}

export const FilterList = (props: IProps) => {
  const elementRef = useRef<HTMLDivElement>(null)
  const [disableLeftArrow, setDisableLeftArrow] = useState<boolean>(true)
  const [disableRightArrow, setDisableRightArrow] = useState<boolean>(false)
  const { activeFilters, availableFilters, onFilterChange } = props

  const handleHorizantalScroll = (step: number) => {
    const distance = 121
    const element = elementRef.current
    const speed = 10
    let scrollAmount = 0

    const slideTimer = setInterval(() => {
      if (element) {
        element.scrollLeft += step
        scrollAmount += Math.abs(step)
        if (scrollAmount >= distance) {
          clearInterval(slideTimer)
        }
        const { scrollLeft, scrollWidth, clientWidth } = element
        switch (scrollLeft + clientWidth) {
          case clientWidth:
            setDisableLeftArrow(true)
            // scrollWidth && setDisableRightArrow(true)
            break
          case scrollWidth:
            setDisableRightArrow(true)
            break
          default:
            setDisableLeftArrow(false)
            setDisableRightArrow(false)
            break
        }
      }
    }, speed)
  }

  useEffect(() => {
    handleHorizantalScroll(0)
  }, [])

  if (!availableFilters || availableFilters.length < 2) {
    return null
  }

  return (
    <Flex
      sx={{
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <Flex
        as="ul"
        data-cy="FilterList"
        ref={elementRef}
        sx={{
          listStyle: 'none',
          flexWrap: 'nowrap',
          overflow: 'hidden',
          paddingY: 2,
          paddingX: 4,
          gap: 2,
          zIndex: 1,
          top: '-80px',
          height: 'auto',
        }}
      >
        {availableFilters.map(({ label, type }, index) => {
          const active = activeFilters.find((filter) => filter === type)
          return (
            <CardButton
              as="li"
              data-cy={`MapListFilter${active ? '-active' : ''}`}
              key={index}
              onClick={() => onFilterChange(type)}
              extrastyles={{
                backgroundColor: 'offWhite',
                padding: 1,
                textAlign: 'center',
                width: '130px',
                minWidth: '130px',
                height: '75px',
                flexDirection: 'column',
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
              <MemberBadge size={30} profileType={type} />
              <br />
              <Text variant="quiet" sx={{ fontSize: 1 }}>
                {label}
              </Text>
            </CardButton>
          )
        })}
      </Flex>
      {availableFilters.length > 3 && (
        <Flex
          sx={{
            justifyContent: 'space-between',
            zIndex: 2,
            paddingX: 2,
            position: 'relative',
            top: '-62px',
            height: 0,
          }}
        >
          <ButtonIcon
            onClick={() => handleHorizantalScroll(-10)}
            icon="chevron-left"
            disabled={disableLeftArrow}
            sx={{ height: '28px', borderColor: 'grey' }}
          />
          <ButtonIcon
            data-cy="FilterList-ButtonRight"
            onClick={() => handleHorizantalScroll(10)}
            icon="chevron-right"
            disabled={disableRightArrow}
            sx={{ height: '28px', borderColor: 'grey' }}
          />
        </Flex>
      )}
    </Flex>
  )
}
