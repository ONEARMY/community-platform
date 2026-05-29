import type { Category } from 'oa-shared';
import { Text } from 'theme-ui';
import { CardButton } from '../CardButton/CardButton';
import { VerticalList } from '../VerticalList/VerticalList.client';

export interface IProps {
  activeCategory: Category | null;
  allCategories: Category[];
  setActiveCategory: (category: Category | null) => void;
}

export const CategoryHorizonalList = (props: IProps) => {
  const { activeCategory, allCategories, setActiveCategory } = props;

  if (!allCategories || !allCategories.length || allCategories.length < 3) {
    return null;
  }

  const orderedCategories = allCategories
    .slice()
    .sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));

  const isCategorySelected = (category: Category) => {
    return category.id === activeCategory?.id;
  };

  return (
    <VerticalList dataCy="CategoryHorizonalList">
      {orderedCategories.map((category, index) => {
        const isSelected = isCategorySelected(category);

        return (
          <CardButton
            data-cy={`CategoryHorizonalList-Item${isSelected ? '-active' : ''}`}
            data-testid="CategoryHorizonalList-Item"
            title={category.name}
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
            {category.imageUrl && (
              <img
                src={category.imageUrl}
                alt={category.name}
                style={{
                  width: '40px',
                  height: '40px',
                  objectFit: 'cover',
                  borderRadius: '4px',
                }}
              />
            )}
            <Text variant="quiet" sx={{ fontSize: 1 }}>
              {category.name}
            </Text>
            {category.description && (
              <Text
                variant="quiet"
                sx={{
                  fontSize: 0,
                  marginTop: 1,
                  color: 'grey',
                  lineHeight: 1.2,
                }}
              >
                {category.description}
              </Text>
            )}
          </CardButton>
        );
      })}
    </VerticalList>
  );
};
