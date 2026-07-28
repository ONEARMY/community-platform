import { observer } from 'mobx-react';
import { useContext } from 'react';
import { TenantContext } from 'src/pages/common/TenantContext';
import { useProfileStore } from 'src/stores/Profile/profile.store';
import { Flex, Link, Text } from 'theme-ui';
import { organisationModeration } from '../../labels';

export const OrganisationModerationSection = observer(() => {
  const { profile } = useProfileStore();
  const tenantContext = useContext(TenantContext);

  const moderation = profile?.moderation;
  if (moderation !== 'awaiting-moderation' && moderation !== 'improvements-needed') {
    return null;
  }

  const message = organisationModeration[moderation];
  const contactEmail = tenantContext?.emailFrom;

  return (
    <Flex
      data-cy="organisation-moderation-details"
      sx={{
        flexDirection: 'column',
        gap: 2,
        marginBottom: 4,
        padding: [3, '22px'],
        borderRadius: 3,
        border: '2px solid',
        borderColor: 'black',
        backgroundColor: message.background,
        color: 'black',
      }}
    >
      <Text sx={{ fontFamily: 'title', fontSize: 5 }}>{message.title}</Text>
      <Text sx={{ fontSize: 3, lineHeight: 1.4 }}>
        {message.body}
        {contactEmail && (
          <>
            {' '}
            {message.contactPrefix}{' '}
            <Link
              href={`mailto:${contactEmail}`}
              sx={{ color: 'inherit', textDecoration: 'underline' }}
            >
              {contactEmail}
            </Link>
            .
          </>
        )}
        {message.afterContact && <> {message.afterContact}</>}
      </Text>
    </Flex>
  );
});
