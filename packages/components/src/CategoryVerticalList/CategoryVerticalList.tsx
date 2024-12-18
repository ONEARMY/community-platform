import { Text } from 'theme-ui'

import { CardButton } from '../CardButton/CardButton'
import { getGlyph, Icon } from '../Icon/Icon'
import { VerticalList } from '../VerticalList/VerticalList.client'

import type { ICategory } from 'oa-shared'
import type { availableGlyphs } from '../Icon/types'

export interface IProps {
  activeCategory: ICategory | null
  allCategories: ICategory[]
  setActiveCategory: (category: ICategory | null) => void
}

export const CategoryVerticalList = (props: IProps) => {
  const { activeCategory, allCategories, setActiveCategory } = props

  if (!allCategories || !allCategories.length || allCategories.length < 3) {
    return null
  }

  const orderedCategories = allCategories.toSorted((a, b) =>
    a._created > b._created ? 1 : -1,
  )

  return (
    <VerticalList dataCy="CategoryVerticalList">
      {orderedCategories.map((category, index) => {
        const active = category._id === activeCategory?._id
        const glyph = category.label.toLowerCase() as availableGlyphs
        const hasGlyph = getGlyph(glyph)

        return (
          <CardButton
            data-cy={`CategoryVerticalList-Item${active ? '-active' : ''}`}
            data-testid="CategoryVerticalList-Item"
            title={category.label}
            key={index}
            onClick={() => setActiveCategory(active ? null : category)}
            extrastyles={{
              alignItems: 'center',
              background: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              justifyContent: 'center',
              minWidth: '130px',
              marginX: 1,
              padding: 1,
              textAlign: 'center',
              width: '130px',
              ...(active
                ? {
                    borderColor: 'green',
                    ':hover': { borderColor: 'green' },
                  }
                : {
                    borderColor: 'background',
                    ':hover': { borderColor: 'background' },
                  }),
            }}
          >
            <Icon size={40} glyph={hasGlyph ? glyph : 'category'} />
            <Text variant="quiet" sx={{ fontSize: 1 }}>
              {category.label}
            </Text>
          </CardButton>
        )
      })}
    </VerticalList>
  )
}
