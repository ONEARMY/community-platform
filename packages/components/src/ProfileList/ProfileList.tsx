import { Avatar, Box, Flex, Text } from 'theme-ui';

import { Button } from '../Button/Button';
import { MemberBadge } from '../MemberBadge/MemberBadge';
import { Username } from '../Username/Username';

import type { ProfileListItem } from 'oa-shared';

interface IProps {
  profiles: ProfileListItem[];
  onClose?: () => void;
  children?: React.ReactNode;
  header: string;
}

export const ProfileList = ({ profiles = [], onClose, header }: IProps) => {
  return (
    <Flex
      data-cy="profile-list-modal"
      sx={{
        position: 'fixed',
        inset: 0,
        bg: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <Box
        sx={{
          bg: 'background',
          borderRadius: '10px',
          width: ['80%', '23%'],
          height: 'auto',
          maxHeight: ['40%', '50%'],
          border: '2px solid',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Flex
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '2px solid',
            borderColor: 'muted',
            p: 1,
            width: '100%',
            position: 'relative',
          }}
        >
          <Text
            sx={{
              fontWeight: 600,
              fontSize: 2,
              textAlign: 'center',
              width: '100%',
            }}
          >
            {header}
          </Text>
          <Button variant="subtle" showIconOnly icon="close" small onClick={onClose} />
        </Flex>

        <Box
          sx={{
            flex: '1 1 auto',
            overflowY: 'auto',
            pl: 3,
          }}
        >
          {profiles.length === 0 ? (
            <Text sx={{ textAlign: 'center', color: 'muted', fontSize: 1 }}>No users yet.</Text>
          ) : (
            <Box
              as="ul"
              sx={{
                listStyle: 'none',
                m: 0,
                p: 0,
              }}
            >
              {profiles.map((profile) => (
                <Flex
                  as="li"
                  key={profile.id}
                  sx={{
                    alignItems: 'center',
                    py: 2,
                    gap: 2,
                  }}
                >
                  {profile.photo ? (
                    <Avatar
                      src={profile.photo?.publicUrl}
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        objectFit: 'cover',
                      }}
                      loading="lazy"
                    />
                  ) : (
                    <MemberBadge
                      profileType={profile.type || undefined}
                      sx={{ cursor: 'pointer' }}
                    />
                  )}
                  <Box>
                    <Username user={profile} />
                  </Box>
                </Flex>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Flex>
  );
};
