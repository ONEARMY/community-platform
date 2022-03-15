import { format } from 'date-fns'
import * as React from 'react'
import { Box, Flex, Image } from 'rebass'
import ArrowIcon from 'src/assets/icons/icon-arrow-select.svg'
import { Button } from 'oa-components'
import Heading from 'src/components/Heading'
import { Link } from 'src/components/Links'
import ModerationStatusText from 'src/components/ModerationStatusText'
import Text from 'src/components/Text'
import { IResearch } from 'src/models/research.models'
import theme from 'src/themes/styled.theme'
import { VerifiedUserBadge } from 'src/components/VerifiedUserBadge/VerifiedUserBadge'
interface IProps {
  research: IResearch.ItemDB
  isEditable: boolean
  needsModeration: boolean
  moderateResearch: (accepted: boolean) => void
}

const ResearchDescription: React.FC<IProps> = ({
  research,
  isEditable,
  ...props
}) => {
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
          {/* Check if research should be moderated */}
          {props.needsModeration && (
            <Flex justifyContent={'space-between'}>
              <Button
                data-cy={'accept'}
                variant={'primary'}
                icon="check"
                mr={1}
                onClick={() => props.moderateResearch(true)}
              />
              <Button
                data-cy="reject-research"
                variant={'tertiary'}
                icon="delete"
                onClick={() => props.moderateResearch(false)}
              />
            </Flex>
          )}
          {/* Show edit button for the creator of the research OR a super-admin */}
          {isEditable && (
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
              <Flex alignItems="center">
                By
                <Link
                  ml={1}
                  mr={1}
                  sx={{
                    textDecoration: 'underline',
                    color: 'inherit',
                  }}
                  to={'/u/' + research._createdBy}
                >
                  {research._createdBy}
                </Link>
                <VerifiedUserBadge
                  userId={research._createdBy}
                  mr={1}
                  width="12px"
                  height="12px"
                />
                | Started on {format(new Date(research._created), 'DD-MM-YYYY')}
              </Flex>
            </Text>
          </Flex>
          <Text
            auxiliary
            sx={{ color: `${theme.colors.lightgrey} !important` }}
            mt={1}
            mb={2}
          >
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
          moderatedContent={research}
          contentType="research"
          bottom={'0'}
          cropBottomRight
        />
      )}
    </Flex>
  )
}

export default ResearchDescription
