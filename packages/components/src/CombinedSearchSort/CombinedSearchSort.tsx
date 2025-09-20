import { Flex } from 'theme-ui'

import { SearchField } from '../SearchField/SearchField'
import { Select } from '../Select/Select'

import type { ThemeUIStyleObject } from 'theme-ui'

export interface IProps {
  sortOptions: Array<{ label: string; value: string }>
  sortPlaceholder: string
  sortValue: { label: string; value: string }
  onSortChange: (option: { label: string; value: string }) => void
  searchValue: string
  searchPlaceholder: string
  onSearchChange: (value: string) => void
  onSearchDelete: () => void
  onSearchSubmit: () => void
  dataCy?: string
}

export const CombinedSearchSort = (props: IProps) => {
  const {
    sortOptions,
    sortPlaceholder,
    sortValue,
    onSortChange,
    searchValue,
    searchPlaceholder,
    onSearchChange,
    onSearchDelete,
    onSearchSubmit,
    dataCy = 'combined-search-sort',
  } = props

  const containerStyles: ThemeUIStyleObject = {
    width: '100%',
    display: 'flex',
    gap: 0,
  }

  const sortContainerStyles: ThemeUIStyleObject = {
    width: '150px',
    flexShrink: 0,
    position: 'relative',
    '& > div': {
      height: '48px',
      minHeight: '48px',
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
      borderRight: 'none',
      border: '2px solid',
      borderColor: 'border',
      '& > div': {
        border: 'none',
        outline: 'none',
        boxShadow: 'none',
        whiteSpace: 'normal',
        overflow: 'visible',
        textOverflow: 'unset',
        '& > div': {
          whiteSpace: 'normal',
          wordWrap: 'break-word',
          lineHeight: 1.2,
          '& > div': {
            whiteSpace: 'normal',
            wordWrap: 'break-word',
          },
        },
      } as any,
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      right: 0,
      top: '10px',
      bottom: '10px',
      width: '1px',
      backgroundColor: 'rgba(0,0,0,0.12)',
      zIndex: 1,
    },
  }

  const searchStyles: ThemeUIStyleObject = {
    fontSize: 2,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    marginLeft: '-1px',
    height: '48px',
    minHeight: '48px',
    paddingX: 3,
    border: '2px solid',
    borderColor: 'border',
    borderLeft: 'none',
  }

  return (
    <Flex sx={containerStyles} data-cy={dataCy}>
      <Flex sx={sortContainerStyles}>
        <Select
          options={sortOptions}
          placeholder={sortPlaceholder}
          value={sortValue}
          onChange={onSortChange}
        />
      </Flex>
      <Flex sx={{ flex: 1 }}>
        <SearchField
          dataCy={`${dataCy}-search`}
          placeHolder={searchPlaceholder}
          value={searchValue}
          onChange={onSearchChange}
          onClickDelete={onSearchDelete}
          onClickSearch={onSearchSubmit}
          additionalStyle={searchStyles}
        />
      </Flex>
    </Flex>
  )
}
