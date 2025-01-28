import { Flex, Heading } from 'theme-ui'

interface IProps {
  actionComponents: React.ReactNode
  headingTitle: string
  categoryComponent: React.ReactNode
  filteringComponents: React.ReactNode
  showDrafts: boolean
}

export const ListHeader = (props: IProps) => {
  const {
    actionComponents,
    headingTitle,
    showDrafts,
    categoryComponent,
    filteringComponents,
  } = props

  return (
    <>
      <Flex
        sx={{
          paddingTop: [6, 12],
          paddingBottom: [4, 8],
          flexDirection: 'column',
          gap: [4, 8],
        }}
      >
        <Heading
          as="h1"
          sx={{
            marginX: 'auto',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 5,
          }}
        >
          {headingTitle}
        </Heading>
        <Flex sx={{ justifyContent: 'center' }}>{categoryComponent}</Flex>
      </Flex>

      <Flex
        sx={{
          justifyContent: 'space-between',
          flexDirection: ['column', 'column', 'row'],
          gap: 2,
          paddingX: [2, 0],
        }}
      >
        {!showDrafts ? filteringComponents : <div></div>}

        <Flex sx={{ gap: 2, alignContent: 'flex-end', alignSelf: 'flex-end' }}>
          {actionComponents}
        </Flex>
      </Flex>
    </>
  )
}
