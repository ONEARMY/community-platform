import { Box, Flex, Text } from 'theme-ui'
import { FlagIconHowTos } from 'oa-components'
import { IComment } from 'src/models'
import { Link } from 'src/components/Links'
import theme from 'src/themes/styled.theme'
import { VerifiedUserBadge } from '../VerifiedUserBadge/VerifiedUserBadge'

interface IProps extends Omit<IComment, 'text' | '_id' | '_creatorId'> {}

export const CommentHeader = ({
  creatorName,
  creatorCountry,
  _created,
  _edited,
}: IProps) => {
  return (
    <Flex sx={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
      <Box>
        {creatorCountry && <FlagIconHowTos code={creatorCountry} />}
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
          <VerifiedUserBadge
            userId={creatorName}
            ml={1}
            height="12px"
            width="12px"
          />
        </span>
      </Box>
      <Flex sx={{alignItems:"center"}}>
        {_edited ? (
          <>
            <Text color={theme.colors.grey} sx={{fontSize: 0}} mr={2}>
              (Edited)
            </Text>
            <Text sx={{fontSize: 1}}>
              {new Date(_edited)
                .toLocaleDateString('en-GB')
                .replaceAll('/', '-')}
            </Text>
          </>
        ) : (
          <Text sx={{fontSize: 1}}>
            {new Date(_created)
              .toLocaleDateString('en-GB')
              .replaceAll('/', '-')}
          </Text>
        )}
      </Flex>
    </Flex>
  )
}
