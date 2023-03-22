import React from 'react'
import { Box, Checkbox, Label, Text } from 'theme-ui'
import { Icon } from 'oa-components'
import styled from '@emotion/styled'

type Props = {
  field: string
  filterOptions: string[]
  filterValues: any[]
  filterValueChanged: (filterValues: any[]) => void
  open: boolean
  setopen: (open: boolean) => void
  toOpen: string
  settoOpen: (toOpen: string) => void
}

const Top = styled(Box)`
  position: absolute;
  top: 23px;
  left: -25px;
  width: 0px;
  height: 0px;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-bottom: 15px solid white;
`

const HeadFilter = (props: Props) => {
  const {
    field,
    filterOptions,
    filterValues,
    filterValueChanged,
    open,
    setopen,
    toOpen,
    settoOpen,
  } = props

  const toggleFilter = (value: any) => {
    const filterIndex = filterValues.indexOf(value)
    if (filterIndex > -1) {
      filterValues.splice(filterIndex)
    } else {
      filterValues.push(value)
    }
    filterValueChanged(filterValues)
  }

  return (
    <Box
      sx={{
        backgroundColor: '#E2EDF7',
        borderRadius: '10px',
        p: 2,
        ml: 1,
        display: 'flex',
        alignItems: 'center',
        height: '2.5rem',
        border:
          open && toOpen == field
            ? '2px solid #000000'
            : '2px solid transparent',
      }}
    >
      <Text sx={{ display: 'flex', alignItems: 'center' }}>
        <Icon
          glyph="filter"
          onClick={() => {
            settoOpen(field)
            setopen(!open)
          }}
        />
      </Text>
      {open && toOpen == field && (
        <Box style={{ position: 'relative' }}>
          <Top />
          <Box
            sx={{
              position: 'absolute',
              top: 7,
              left: -8,
              minHeight: '6rem',
              p: 2,
              background: 'white',
              width: '15rem',
              borderRadius: '10px',
            }}
          >
            {filterOptions.map((value) => (
              <Label key={value}>
                <Checkbox
                  value={value}
                  defaultChecked={filterValues.includes(value)}
                  onChange={() => toggleFilter(value)}
                />
                {value} {filterValues.includes(value)}
              </Label>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default React.memo(HeadFilter)
