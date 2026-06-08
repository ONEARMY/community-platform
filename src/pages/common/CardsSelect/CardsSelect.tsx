import { Flex, Grid, Heading, Image, Text } from 'theme-ui';

export interface CardSelectOption {
  value: string;
  label: string;
  image?: string;
  paragraph: string;
}

export interface CardsSelectProps {
  options: CardSelectOption[];
  selectedValue?: string | null;
  onChange: (value: string) => void;
  error?: boolean;
  'data-cy'?: string;
}

export const CardsSelect = ({
  options,
  selectedValue,
  onChange,
  error = false,
  'data-cy': dataCy,
}: CardsSelectProps) => {
  return (
    <Grid
      data-cy={dataCy}
      gap={1}
      role="radiogroup"
      sx={{
        gridTemplateColumns: 'repeat(2, minmax(0, 300px))',
        '@media screen and (min-width: 640px)': {
          gridTemplateColumns: 'repeat(3, minmax(0, 300px))',
        },
        '@media screen and (min-width: 832px)': {
          gridTemplateColumns: 'repeat(2, minmax(0, 300px))',
        },
        '@media screen and (min-width: 1020px)': {
          gridTemplateColumns: 'repeat(3, minmax(0, 300px))',
        },
        '@media screen and (min-width: 1400px)': {
          gridTemplateColumns: 'repeat(4, minmax(0, 300px))',
        },
      }}
    >
      {options.map((option) => {
        const isSelected = option.value === selectedValue;

        return (
          <Flex
            key={option.value}
            role="radio"
            aria-checked={isSelected}
            tabIndex={0}
            data-cy={`cards-select-${option.value}`}
            className={isSelected ? 'selected' : undefined}
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onChange(option.value);
              }
            }}
            sx={{
              flexDirection: 'row',
              gap: 2,
              padding: 2,
              height: ['120px', '110px'],
              maxWidth: '300px',
              overflow: 'hidden',
              borderRadius: 1,
              border: '2px solid transparent',
              borderColor: error ? 'error' : 'transparent',
              backgroundColor: 'background',
              cursor: 'pointer',
              ':hover': {
                borderColor: error ? 'error' : 'highlightHover',
              },
              '&.selected': {
                borderColor: 'highlight',
              },
            }}
          >
            {option.image && (
              <Image
                src={option.image}
                alt=""
                sx={{ width: 32, height: 32, objectFit: 'contain', flexShrink: 0 }}
              />
            )}
            <Flex
              sx={{
                alignItems: 'start',
                flexDirection: 'column',
                paddingTop: 1,
                minWidth: 0,
              }}
            >
              <Heading
                as="h3"
                sx={{
                  fontSize: 3,
                  maxWidth: '100%',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {option.label}
              </Heading>
              <Text
                sx={{
                  fontSize: 1,
                  color: 'darkGrey',
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: [5, 4],
                  overflow: 'hidden',
                }}
              >
                {option.paragraph}
              </Text>
            </Flex>
          </Flex>
        );
      })}
    </Grid>
  );
};
