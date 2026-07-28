import { observer } from 'mobx-react';
import { Button, ExternalLink, MemberBadge } from 'oa-components';
import { useContext, useState } from 'react';
import { Form } from 'react-final-form';
import { useToast } from 'src/common/Toast';
import { TenantContext } from 'src/pages/common/TenantContext';
import { profileService } from 'src/services/profileService';
import { useProfileStore } from 'src/stores/Profile/profile.store';
import { Box, Flex, Grid, Heading, Paragraph, Text } from 'theme-ui';
import { buttons, fields, focusSection, form as formLabels, headings } from '../../labels';
import { ProfileSection } from '../elements';
import { ProfileTypeRadioField } from '../fields/ProfileTypeRadio.field';

export const FocusSection = observer(() => {
  const toast = useToast();
  const tenantContext = useContext(TenantContext);
  const profileStore = useProfileStore();
  const { profile, profileTypes } = profileStore;

  const [isEditing, setIsEditing] = useState(false);

  const currentType = profile?.type;

  if (!currentType?.isSpace) {
    return null;
  }

  const spaceTypes = (profileTypes || [])
    .filter((type) => type.isSpace)
    .sort((a, b) => a.order - b.order);

  if (spaceTypes.length < 2) {
    return null;
  }

  const handleSave = ({ type }: { type?: string }) => {
    const selected = spaceTypes.find((t) => t.name === type);

    if (!selected || selected.name === currentType.name) {
      setIsEditing(false);
      return;
    }

    const promise = profileService.updateProfileType(selected.id);

    toast.promise(promise, {
      loading: formLabels.focusChanging,
      success: (updated) => {
        profileStore.update(updated);
        profileStore.refresh();
        setIsEditing(false);
        return formLabels.focusChanged;
      },
      error: (error) => `Error: ${error.message}`,
    });
  };

  return (
    <ProfileSection data-cy="FocusSection">
      <Flex sx={{ flexDirection: 'column', gap: 1 }}>
        <Heading as="h2">{headings.focus}</Heading>
        <Paragraph sx={{ color: 'grey', fontSize: 3 }}>
          {fields.activities.description}{' '}
          <ExternalLink
            href={tenantContext?.profileGuidelines}
            sx={{ textDecoration: 'underline' }}
            type="button"
          >
            {buttons.guidelines}
          </ExternalLink>
        </Paragraph>
      </Flex>

      <Flex
        data-cy="focus-current"
        sx={{
          alignItems: 'center',
          gap: 4,
          paddingX: 4,
          paddingY: 6,
          borderRadius: 3,
          backgroundColor: 'background',
        }}
      >
        <MemberBadge size={90} profileType={currentType} />
        <Box sx={{ flex: 1 }}>
          <Text sx={{ display: 'block', fontFamily: 'title', fontSize: 1 }}>
            {focusSection.currentLabel}
          </Text>
          <Text as="p" sx={{ fontSize: 5 }}>
            {currentType.displayName}
          </Text>
          <Text variant="quiet" sx={{ fontSize: 2 }}>
            {currentType.description}
          </Text>
        </Box>
        {!isEditing && (
          <Button
            type="button"
            variant="outline"
            data-cy="focus-change"
            onClick={() => setIsEditing(true)}
          >
            {buttons.change}
          </Button>
        )}
      </Flex>

      {isEditing && (
        <Form
          onSubmit={handleSave}
          initialValues={{ type: currentType.name }}
          render={({ handleSubmit, values, form, submitting }) => (
            <Flex sx={{ flexDirection: 'column', gap: 4 }}>
              <Grid columns={['repeat(auto-fill, minmax(125px, 1fr))']} gap={2}>
                {spaceTypes.map((profileType) => (
                  <Box key={profileType.name}>
                    <ProfileTypeRadioField
                      data-cy={profileType.name}
                      value={profileType}
                      name="type"
                      isSelected={profileType.name === values.type}
                      onChange={(v) => form.change('type', v)}
                      textLabel={profileType.displayName}
                    />
                  </Box>
                ))}
              </Grid>
              <Button
                type="button"
                variant="primary"
                data-cy="focus-save"
                disabled={submitting}
                onClick={handleSubmit}
                sx={{ alignSelf: 'flex-start' }}
              >
                {buttons.saveFocus}
              </Button>
            </Flex>
          )}
        />
      )}
    </ProfileSection>
  );
});
