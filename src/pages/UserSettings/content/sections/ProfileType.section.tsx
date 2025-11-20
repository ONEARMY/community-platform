import { Field } from 'react-final-form';
import { ExternalLink } from 'oa-components';
import { buttons, fields, headings } from 'src/pages/UserSettings/labels';
import { Box, Flex, Grid, Heading, Paragraph, Text, useThemeUI } from 'theme-ui';

import { FlexSectionContainer } from '../elements';
import { ProfileTypeRadioField } from '../fields/ProfileTypeRadio.field';

import type { ProfileType } from 'oa-shared';
import type { ThemeWithName } from 'oa-themes';

type ProfileTypeSectionProps = {
  profileTypes: ProfileType[];
};
export const ProfileTypeSection = ({ profileTypes }: ProfileTypeSectionProps) => {
  const profileGuidelinesUrl =
    import.meta.env.VITE_PROFILE_GUIDELINES_URL || process.env.VITE_PROFILE_GUIDELINES_URL;
  const { description, error } = fields.activities;
  const themeUi = useThemeUI();
  const theme = themeUi.theme as ThemeWithName;

  if (!profileTypes || profileTypes.length < 2) {
    return null;
  }

  return (
    <Field
      name="type"
      render={(props) => (
        <FlexSectionContainer data-cy="FocusSection">
          <Flex sx={{ flexDirection: 'column', gap: 1 }}>
            <Heading as="h2">{headings.focus}</Heading>
            <Paragraph>
              {description}{' '}
              <ExternalLink
                href={profileGuidelinesUrl}
                sx={{ textDecoration: 'underline', color: 'grey' }}
                type="button"
              >
                {buttons.guidelines}
              </ExternalLink>
            </Paragraph>
          </Flex>

          <Flex sx={{ flexDirection: 'column', gap: 4 }}>
            {props.meta.error && <Text color={theme.colors.red}>{error}</Text>}

            <Grid columns={['repeat(auto-fill, minmax(125px, 1fr))']} gap={2}>
              {profileTypes
                .slice()
                .sort((a, b) => {
                  if (a.isSpace !== b.isSpace) {
                    return a.isSpace ? 1 : -1;
                  }
                  return a.order - b.order;
                })
                .map((profileType, index: number) => (
                  <Box key={index}>
                    <ProfileTypeRadioField
                      data-cy={profileType.name}
                      value={profileType}
                      name="type"
                      isSelected={profileType.name === props.input.value}
                      onChange={(v) => props.input.onChange(v)}
                      textLabel={profileType.displayName}
                    />
                  </Box>
                ))}
            </Grid>
          </Flex>
        </FlexSectionContainer>
      )}
    />
  );
};
