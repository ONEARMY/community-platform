import { Select } from 'oa-components';
import { NEWS_CONTENT_REACH_DEFAULT, NewsContentReachOptionList } from 'oa-shared';
import { Field } from 'react-final-form';
import { Box } from 'theme-ui';
import { contentReach } from '../../labels';

export const NewsContentReachOptions = NewsContentReachOptionList.map((option) => ({
  value: option,
  label: contentReach[option],
}));

export const defaultNewContentReachValue = NewsContentReachOptions.find(
  ({ value }) => value === NEWS_CONTENT_REACH_DEFAULT,
) as { value: typeof NEWS_CONTENT_REACH_DEFAULT; label: string };

export const NotificationsNewsField = ({ defaultValue }) => {
  const name = 'news';

  return (
    <Box sx={{ width: '100%', marginX: [6, 6, 8] }}>
      <Field
        name={name}
        id={name}
        render={({ input, ...rest }) => {
          return (
            <Select
              {...rest}
              variant="form"
              options={NewsContentReachOptions}
              value={input.value}
              onChange={(changedValue) => {
                input.onChange(changedValue);
              }}
            />
          );
        }}
      />
    </Box>
  );
};
