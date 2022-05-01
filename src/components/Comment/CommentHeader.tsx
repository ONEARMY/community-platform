import { Box, Flex, Text } from 'theme-ui'
import { FlagIcon } from 'oa-components'
import type { IComment } from 'src/models'
import { Link } from 'src/components/Link/Link'
import theme from 'src/themes/styled.theme'
import { Image } from 'theme-ui'
import VerifiedBadgeIcon from 'src/assets/icons/icon-verified-badge.svg'

interface IProps extends Omit<IComment, 'text' | '_id' | '_creatorId'> {
  isUserVerified?: boolean
}

export const CommentHeader = ({
  creatorName,
  creatorCountry,
  _created,
  _edited,
  isUserVerified,
}: IProps) => {
  return (
    <Flex sx={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
      <Box>
        {creatorCountry && <FlagIcon code={creatorCountry} width={21} />}
        <span style={{ marginLeft: creatorCountry ? '5px' : 0 }}>
          <Link
            sx={{
              textDecoration: 'underline',
              color: 'inherit',
            }}
            to={'/u/' + creatorName}
          >
            {creatorName}
          </Link>
          {isUserVerified ? (
            <Image src={VerifiedBadgeIcon} ml={1} height="12px" width="12px" />
          ) : null}
        </span>
      </Box>
      <Flex sx={{ alignItems: 'center' }}>
        {_edited ? (
          <>
            <Text color={theme.colors.grey} sx={{ fontSize: 0 }} mr={2}>
              (Edited)
            </Text>
            <Text sx={{ fontSize: 1 }}>
              {new Date(_edited)
                .toLocaleDateString('en-GB')
                .replaceAll('/', '-')}
            </Text>
          </>
        ) : (
          <Text sx={{ fontSize: 1 }}>
            {new Date(_created)
              .toLocaleDateString('en-GB')
              .replaceAll('/', '-')}
          </Text>
        )}
      </Flex>
    </Flex>
  )
}
