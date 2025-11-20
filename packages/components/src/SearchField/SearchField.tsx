import { Box, Input } from 'theme-ui';

import { Icon } from '../Icon/Icon';

import type { ThemeUIStyleObject } from 'theme-ui';

export type Props = {
  autoComplete?: string;
  name?: string;
  id?: string;
  dataCy: string;
  placeHolder: string;
  value: string;
  onChange: (value: string) => void;
  onClickDelete: () => void;
  onClickSearch: () => void;
  additionalStyle?: ThemeUIStyleObject;
};

export const SearchField = (props: Props) => {
  const {
    autoComplete = 'on',
    name = 'rand-name',
    id = 'rand-id',
    dataCy,
    placeHolder,
    value,
    onChange,
    onClickDelete,
    onClickSearch,
    additionalStyle = {},
  } = props;

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Input
        autoComplete={autoComplete}
        name={name}
        id={id}
        variant="inputOutline"
        type="search"
        data-cy={dataCy}
        placeholder={placeHolder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        sx={{
          paddingRight: 11,
          '::-webkit-search-cancel-button': {
            display: 'none',
          },
          '::-ms-clear': {
            display: 'none',
          },
          ...additionalStyle,
        }}
      />
      <Box
        sx={{
          right: 2,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {value && (
          <Icon
            sx={{
              display: 'flex',
              alignItems: 'center',
              marginRight: 1,
            }}
            glyph="close"
            onClick={onClickDelete}
            size="17"
          />
        )}
        <Icon
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
          glyph="search"
          onClick={onClickSearch}
          size="19"
        />
      </Box>
    </Box>
  );
};
