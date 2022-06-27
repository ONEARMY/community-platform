import React from 'react'
import { Box, Checkbox, Label, Text } from 'theme-ui'
import { Icon } from 'oa-components'
import styled from '@emotion/styled'

type Props = {
  val: string
  filter: string[]
  filterBy: string[]
  setFilterBy: (values: string[]) => void
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

function HeadFilter(props: Props) {
  const {
    val,
    filter,
    filterBy,
    setFilterBy,
    open,
    setopen,
    toOpen,
    settoOpen,
  } = props

  const handleChange = (e) => {
    const { value, checked } = e.target
    const temp: string[] = [...filterBy]
    if (checked) {
      temp.push(value)
      setFilterBy(temp)
    } else {
      const index = temp.findIndex((it) => it == value)
      if (index !== -1) {
        temp.splice(index, 1)
        setFilterBy(temp)
      }
    }
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
      }}
    >
      <Text sx={{ display: 'flex', alignItems: 'center' }}>
        <Icon
          glyph="filter"
          onClick={() => {
            settoOpen(val)
            setopen(!open)
          }}
        />
      </Text>
      {open && toOpen == val && (
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
            {filter.map((text) => (
              <Label key={text}>
                <Checkbox
                  value={`${val}-${text}`}
                  checked={filterBy.includes(`${val}-${text}`)}
                  onChange={(e) => handleChange(e)}
                />
                {text}
              </Label>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default React.memo(HeadFilter)
