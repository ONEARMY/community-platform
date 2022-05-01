import { FlagIcon } from '../FlagIcon/FlagIcon'
import { Flex, Box, Link, Text, Image } from 'theme-ui'
import { useTheme } from '@emotion/react'

export interface Props {
  creatorName: string
  _created: string
  isUserVerified: boolean
  _edited?: string
  creatorCountry?: string
}

const formatDateStr = (str: string) =>
  new Date(str).toLocaleDateString('en-GB').replaceAll('/', '-')

export const CommentHeading = (props: Props) => {
  const { creatorCountry, creatorName, isUserVerified, _edited, _created } =
    props
  const theme: any = useTheme()

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
            <Image src={''} ml={1} height="12px" width="12px" />
          ) : null}
        </span>
      </Box>
      <Flex sx={{ alignItems: 'center' }}>
        {_edited ? (
          <>
            <Text color={theme.colors.grey} sx={{ fontSize: 0 }} mr={2}>
              (Edited)
            </Text>
            <Text sx={{ fontSize: 1 }}>{formatDateStr(_edited)}</Text>
          </>
        ) : (
          <Text sx={{ fontSize: 1 }}>{formatDateStr(_created)}</Text>
        )}
      </Flex>
    </Flex>
  )
}
