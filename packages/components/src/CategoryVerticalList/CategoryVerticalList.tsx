import { Text } from 'theme-ui'

import { CardButton } from '../CardButton/CardButton'
import { getGlyph, Icon } from '../Icon/Icon'
import { VerticalList } from '../VerticalList/VerticalList.client'

import type { DBCategory, ICategory } from 'oa-shared'
import type { availableGlyphs } from '../Icon/types'

export interface IProps {
  activeCategory: DBCategory | ICategory | null
  allCategories: (DBCategory | ICategory)[]
  setActiveCategory: (category: DBCategory | ICategory | null) => void
}

export const CategoryVerticalList = (props: IProps) => {
  const { activeCategory, allCategories, setActiveCategory } = props

  if (!allCategories || !allCategories.length || allCategories.length < 3) {
    return null
  }

  const orderedCategories = allCategories.toSorted((a, b) =>
    (a as DBCategory).created_at
      ? (a as DBCategory).created_at > (b as DBCategory).created_at
        ? 1
        : -1
      : (a as ICategory)._created > (b as ICategory)._created
        ? 1
        : -1,
  )

  const isCategorySelected = (category: DBCategory | ICategory) => {
    if ((category as DBCategory).id) {
      return (category as DBCategory).id === (activeCategory as DBCategory)?.id
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
          (category as DBCategory).name || (category as ICategory).label
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
