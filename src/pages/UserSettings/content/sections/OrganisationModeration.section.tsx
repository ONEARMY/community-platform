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

  const feedback = profile?.moderationFeedback?.trim();
  const showFeedback = moderation === 'improvements-needed' && !!feedback;
  const body = showFeedback ? message.body : (message.bodyWithoutFeedback ?? message.body);

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

      {showFeedback && (
        <Flex
          data-cy="organisation-moderation-feedback"
          sx={{
            flexDirection: 'column',
            gap: 1,
            padding: 3,
            borderRadius: 2,
            backgroundColor: 'white',
          }}
        >
          <Text sx={{ fontFamily: 'title', fontSize: 2 }}>{message.feedbackHeading}</Text>
          <Text sx={{ fontSize: 3, lineHeight: 1.4, whiteSpace: 'pre-wrap' }}>{feedback}</Text>
        </Flex>
      )}

      <Text sx={{ fontSize: 3, lineHeight: 1.4 }}>
        {body}
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
