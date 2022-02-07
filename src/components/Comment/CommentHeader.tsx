import { Box, Flex, Text } from 'rebass/styled-components'
import { FlagIconHowTos } from 'src/components/Icons/FlagIcon/FlagIcon'
import { IComment } from 'src/models'
import { Link } from 'src/components/Links'
import theme from 'src/themes/styled.theme'

interface IProps extends Omit<IComment, 'text' | '_id' | '_creatorId'> {}

export const CommentHeader = ({
  creatorName,
  creatorCountry,
  _created,
  _edited,
}: IProps) => {
  return (
    <Flex justifyContent="space-between" alignItems="baseline">
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
        </span>
      </Box>
      <Flex alignItems="center">
        {_edited ? (
          <>
            <Text color={theme.colors.grey} fontSize={0} mr={2}>
              (Edited)
            </Text>
            <Text fontSize={1}>
              {new Date(_edited)
                .toLocaleDateString('en-GB')
                .replaceAll('/', '-')}
            </Text>
          </>
        ) : (
          <Text fontSize={1}>
            {new Date(_created)
              .toLocaleDateString('en-GB')
              .replaceAll('/', '-')}
          </Text>
        )}
      </Flex>
    </Flex>
  )
}
