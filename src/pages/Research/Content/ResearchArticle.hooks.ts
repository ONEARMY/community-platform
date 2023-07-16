import React from 'react'
import type { RouteComponentProps } from 'react-router'
import { isUserVerifiedWithStore } from 'src/common/isUserVerified'
import type { IResearchDB } from 'src/models'
import { getUserCountry } from 'src/utils/getUserCountry'

export const useResearchItem = (
  props: RouteComponentProps<{ slug: string }>,
  researchStore,
  userStore,
  aggregationsStore,
) => {
  const [isLoading, setIsLoading] = React.useState(true)
  const [researchItem, setResearchItem] = React.useState<
    | (IResearchDB & {
        author: {
          userName: string
          countryCode?: string
          isVerified?: boolean
        }
      })
    | null
  >(null)

  React.useEffect(() => {
    ;(async () => {
      const { slug } = props.match.params

      const getResearchItem = await researchStore.setActiveResearchItemBySlug(
        slug,
      )
      setResearchItem({
        ...getResearchItem,
        author: {
          userName: getResearchItem._createdBy,
        },
      })
      setIsLoading(false)

      // Fetch Research Author
      if (getResearchItem._createdBy) {
        const fetchResearchAuthor = await userStore.getUserByUsername(
          getResearchItem._createdBy,
        )

        if (fetchResearchAuthor) {
          setResearchItem({
            ...getResearchItem,
            author: {
              userName: fetchResearchAuthor.userName,
              countryCode: getUserCountry(fetchResearchAuthor),
              isVerified: isUserVerifiedWithStore(
                fetchResearchAuthor,
                aggregationsStore,
              ),
            },
          })
        }
      }
    })()

    // Reset the store's active item on component cleanup
    return () => {
      researchStore.setActiveResearchItemBySlug()
    }
  }, [props, researchStore])

  return {
    isLoading,
    researchItem,
    activeUser: researchStore.activeUser,
  }
}
