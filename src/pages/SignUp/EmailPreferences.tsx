import { Button, Icon } from 'oa-components';
import type { IGlyphs } from 'oa-components/Icon/types';
import type { ContentReach } from 'oa-shared';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useToast } from 'src/common/Toast';
import { DEFAULT_BOX_PADDING, DEFAULT_ICON_SIZE, DEFAULT_REACH } from 'src/pages/SignUp/constants';
import { emailPreferences as labels } from 'src/pages/SignUp/labels';
import { notificationsPreferencesService } from 'src/services/notificationsPreferencesService';
import { Box, Flex, Heading, Radio, Text } from 'theme-ui';

interface EmailPreferenceOption {
  value: ContentReach;
  glyph: keyof IGlyphs;
  title: string;
  description: string;
  iconSize?: number;
  boxPadding?: number | string;
}

const options: EmailPreferenceOption[] = [
  {
    value: 'all',
    glyph: 'email-stack',
    ...labels.options.all,
    iconSize: 30,
    boxPadding: '7px',
  },
  {
    value: 'important',
    glyph: 'email',
    ...labels.options.important,
  },
  {
    value: null,
    glyph: 'email-off',
    ...labels.options.none,
  },
];

export const EmailPreferences = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [selected, setSelected] = useState<ContentReach>(DEFAULT_REACH);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = () => {
    setSubmitting(true);

    const promise = notificationsPreferencesService
      .setPreferences({
        comments: true,
        replies: true,
        researchUpdates: true,
        isUnsubscribed: false,
        contentReach: selected ? { value: selected, label: selected } : null,
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error(labels.toast.error);
        }
      })
      .finally(() => setSubmitting(false));

    toast.promise(promise, {
      loading: labels.toast.loading,
      success: () => {
        navigate('/settings/profile');
        return labels.toast.success;
      },
      error: (error) => `Error: ${error.message}`,
    });
  };

  return (
    <Flex sx={{ flexDirection: 'column', gap: 8, width: '100%' }}>
      <Flex sx={{ flexDirection: 'column', gap: 1 }}>
        <Heading>{labels.heading}</Heading>
        <Text sx={{ color: 'grey' }}>{labels.subtitle}</Text>
      </Flex>

      <Flex sx={{ flexDirection: 'column', gap: 3 }}>
        {options.map((option) => {
          const isSelected = selected === option.value;
          return (
            <Flex
              key={String(option.value)}
              as="label"
              data-cy={`email-preference-${option.value ?? 'none'}`}
              onClick={() => setSelected(option.value)}
              sx={{
                alignItems: 'center',
                gap: 3,
                cursor: 'pointer',
                ':hover': { opacity: 0.8 },
              }}
            >
              <Flex
                sx={{
                  bg: 'palegrey',
                  borderRadius: 1,
                  padding: option.boxPadding ?? DEFAULT_BOX_PADDING,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon glyph={option.glyph} size={option.iconSize ?? DEFAULT_ICON_SIZE} />
              </Flex>

              <Box sx={{ flex: 1 }}>
                <Text as="h4" sx={{ display: 'block' }}>
                  {option.title}
                </Text>
                <Text sx={{ color: 'darkGrey', fontSize: 2 }}>{option.description}</Text>
              </Box>

              <Radio
                name="email-preference"
                checked={isSelected}
                onChange={() => setSelected(option.value)}
                sx={{
                  'input:checked ~ &': { color: 'highlight' },
                  'input:focus ~ &': { backgroundColor: 'white' },
                }}
              />
            </Flex>
          );
        })}
      </Flex>

      <Button
        large
        type="button"
        data-cy="email-preferences-submit"
        variant="primary"
        disabled={submitting}
        onClick={onSubmit}
        sx={{ borderRadius: 2, width: '100%', justifyContent: 'center' }}
      >
        {labels.submit}
      </Button>
    </Flex>
  );
};
