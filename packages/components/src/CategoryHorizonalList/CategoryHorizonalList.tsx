import { Text } from 'theme-ui'

import { CardButton } from '../CardButton/CardButton'
import { getGlyph, Icon } from '../Icon/Icon'
import { VerticalList } from '../VerticalList/VerticalList.client'

import type { Category } from 'oa-shared'
import type { availableGlyphs } from '../Icon/types'

export interface IProps {
  activeCategory: Category | null
  allCategories: Category[]
  setActiveCategory: (category: Category | null) => void
}

export const CategoryHorizonalList = (props: IProps) => {
  const { activeCategory, allCategories, setActiveCategory } = props

  if (!allCategories || !allCategories.length || allCategories.length < 3) {
    return null
  }

  const orderedCategories = allCategories.toSorted((a, b) =>
    a.createdAt > b.createdAt ? 1 : -1,
  )

  const isCategorySelected = (category: Category) => {
    return category.id === activeCategory?.id
  }

  return (
    <VerticalList dataCy="CategoryHorizonalList">
      {orderedCategories.map((category, index) => {
        const isSelected = isCategorySelected(category)
        const name = category.name
        const glyph = name.toLowerCase() as availableGlyphs
        const hasGlyph = getGlyph(glyph)

        return (
          <CardButton
            data-cy={`CategoryHorizonalList-Item${isSelected ? '-active' : ''}`}
            data-testid="CategoryHorizonalList-Item"
            title={name}
            key={index}
            onClick={() => setActiveCategory(isSelected ? null : category)}
            extrastyles={{
              alignItems: 'center',
              background: 'none',
              flexDirection: 'column',
              justifyContent: 'center',
              minWidth: ['80px', '100px', '130px'],
              marginX: 1,
              paddingY: 2,
              textAlign: 'center',
              width: ['80px', '100px', '130px'],
              ...(isSelected
                ? {
                    borderColor: 'green',
                    ':hover': { borderColor: 'green' },
                  }
                : {
                    borderColor: 'background',
                    ':hover': { borderColor: 'background' },
                  }),
            }}
            isSelected={isSelected}
          >
            <Icon size={40} glyph={hasGlyph ? glyph : 'category'} />
            <Text variant="quiet" sx={{ fontSize: 1 }}>
              {name}
            </Text>
          </CardButton>
        )
      })}
    </VerticalList>
  )
}
