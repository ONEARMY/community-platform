import { Text } from 'theme-ui'

import { CardButton } from '../CardButton/CardButton'
import { getGlyph, Icon } from '../Icon/Icon'
import { VerticalList } from '../VerticalList/VerticalList.client'

import type { Category, ICategory } from 'oa-shared'
import type { availableGlyphs } from '../Icon/types'

export interface IProps {
  activeCategory: Category | ICategory | null
  allCategories: (Category | ICategory)[]
  setActiveCategory: (category: Category | ICategory | null) => void
}

export const CategoryVerticalList = (props: IProps) => {
  const { activeCategory, allCategories, setActiveCategory } = props

  if (!allCategories || !allCategories.length || allCategories.length < 3) {
    return null
  }

  const orderedCategories = allCategories.toSorted((a, b) =>
    (a as Category).createdAt
      ? (a as Category).createdAt > (b as Category).createdAt
        ? 1
        : -1
      : (a as ICategory)._created > (b as ICategory)._created
        ? 1
        : -1,
  )

  const isCategorySelected = (category: Category | ICategory) => {
    if ((category as Category).id) {
      return (category as Category).id === (activeCategory as Category)?.id
    }
    if ((category as ICategory)._id) {
      return (category as ICategory)._id === (activeCategory as ICategory)?._id
    }
  }

  return (
    <VerticalList dataCy="CategoryVerticalList">
      {orderedCategories.map((category, index) => {
        const isSelected = isCategorySelected(category)
        const name =
          (category as Category).name || (category as ICategory).label
        const glyph = name.toLowerCase() as availableGlyphs
        const hasGlyph = getGlyph(glyph)

        return (
          <CardButton
            data-cy={`CategoryVerticalList-Item${isSelected ? '-active' : ''}`}
            data-testid="CategoryVerticalList-Item"
            title={name}
            key={index}
            onClick={() => setActiveCategory(isSelected ? null : category)}
            extrastyles={{
              alignItems: 'center',
              background: 'none',
              flexDirection: 'column',
              justifyContent: 'center',
              minWidth: '130px',
              marginX: 1,
              paddingY: 2,
              textAlign: 'center',
              width: '130px',
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
