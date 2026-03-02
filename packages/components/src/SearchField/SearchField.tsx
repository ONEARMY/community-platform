import type { ThemeUIStyleObject } from 'theme-ui';
import { Box, Input } from 'theme-ui';
import { Icon } from '../Icon/Icon';

export type Props = {
  autoComplete?: string;
  autoFocus?: boolean;
  name?: string;
  id?: string;
  dataCy: string;
  placeHolder: string;
  value: string;
  onChange: (value: string) => void;
  onClickDelete: () => void;
  onClickSearch: () => void;
  onBack?: () => void;
  additionalStyle?: ThemeUIStyleObject;
  isExpanded?: boolean;
};

export const SearchField = (props: Props) => {
  const {
    autoComplete = 'on',
    autoFocus,
    isExpanded,
    name = 'rand-name',
    id = 'rand-id',
    dataCy,
    placeHolder,
    value,
    onChange,
    onClickDelete,
    onClickSearch,
    onBack,
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
        autoFocus={autoFocus}
        name={name}
        id={id}
        variant="inputOutline"
        type="search"
        data-cy={dataCy}
        placeholder={placeHolder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        sx={{
          ...(isExpanded && { paddingLeft: 7 }),
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
      <Box sx={{ left: 2, position: 'absolute', display: 'flex', alignItems: 'center' }}>
        {isExpanded && onBack && (
          <Icon
            sx={{
              display: 'flex',
              alignItems: 'center',
              marginRight: 1,
            }}
            glyph="arrow-back"
            onClick={onBack}
            size="17"
          />
        )}
      </Box>
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
