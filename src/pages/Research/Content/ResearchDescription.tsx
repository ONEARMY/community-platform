import { format } from 'date-fns'
import React from 'react'
import { Box, Flex, Image } from 'rebass'
import ArrowIcon from 'src/assets/icons/icon-arrow-select.svg'
import { Button } from 'src/components/Button'
import Heading from 'src/components/Heading'
import { Link } from 'src/components/Links'
import ModerationStatusText from 'src/components/ModerationStatusText'
import Text from 'src/components/Text'
import { IResearch } from 'src/models/research.models'
import { IUser } from 'src/models/user.models'
import theme from 'src/themes/styled.theme'
import { isAllowToEditContent } from 'src/utils/helpers'

interface IProps {
  research: IResearch.ItemDB
  loggedInUser: IUser | undefined
}

const ResearchDescription: React.FC<IProps> = ({ research, loggedInUser }) => {
  const dateLastUpdateText = (research: IResearch.ItemDB): string => {
    const lastModifiedDate = format(new Date(research._modified), 'DD-MM-YYYY')
    const creationDate = format(new Date(research._created), 'DD-MM-YYYY')
    if (lastModifiedDate !== creationDate) {
      return 'Last update on ' + lastModifiedDate
    } else {
      return ''
    }
  }

  return (
    <Flex
      data-cy="research-basis"
      data-id={research._id}
      sx={{
        position: 'relative',
        borderRadius: theme.radii[2] + 'px',
        bg: 'white',
        borderColor: theme.colors.black,
        borderStyle: 'solid',
        borderWidth: '2px',
        overflow: 'hidden',
        flexDirection: ['column-reverse', 'column-reverse', 'row'],
        mt: 4,
      }}
    >
      <Flex px={4} py={4} flexDirection={'column'} width={1}>
        <Flex justifyContent="space-between" flexWrap="wrap">
          <Link to={'/research'}>
            <Button variant="subtle" fontSize="14px" data-cy="go-back">
              <Flex>
                <Image
                  sx={{
                    width: '10px',
                    marginRight: '4px',
                    transform: 'rotate(90deg)',
                  }}
                  src={ArrowIcon}
                />
                <Text>Back</Text>
              </Flex>
            </Button>
          </Link>
          {/* Show edit button for the creator of the research OR a super-admin */}
          {loggedInUser && isAllowToEditContent(research, loggedInUser) && (
            <Link to={'/research/' + research.slug + '/edit'}>
              <Button variant={'primary'} data-cy={'edit'}>
                Edit
              </Button>
            </Link>
          )}
        </Flex>
        <Box mt={3} mb={2}>
          <Flex alignItems="center">
            <Text inline auxiliary my={2} ml={1}>
              By{' '}
              <Link
                sx={{
                  textDecoration: 'underline',
                  color: 'inherit',
                }}
                to={'/u/' + research._createdBy}
              >
                {research._createdBy}
              </Link>{' '}
              | Started on {format(new Date(research._created), 'DD-MM-YYYY')}
            </Text>
          </Flex>
          <Text auxiliary sx={{ color: '#b7b5b5 !important' }} mt={1} mb={2}>
            {dateLastUpdateText(research)}
          </Text>
          <Heading medium mt={2} mb={1}>
            {research.title}
          </Heading>
          <Text preLine paragraph>
            {research.description}
          </Text>
        </Box>
      </Flex>
      {research.moderation !== 'accepted' && (
        <ModerationStatusText
          moderable={research}
          kind="research"
          bottom={'0'}
          color="red"
          cropBottomRight
        />
      )}
    </Flex>
  )
}

export default ResearchDescription
