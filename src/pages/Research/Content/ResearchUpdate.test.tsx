import { format } from 'date-fns'
import { ThemeProvider } from '@theme-ui/core'
import { render } from '@testing-library/react'
import ResearchUpdate from './ResearchUpdate'
import { faker } from '@faker-js/faker'
import { FactoryResearchItemUpdate } from 'src/test/factories/ResearchItem'
import { FactoryUser } from 'src/test/factories/User'
import { testingThemeStyles } from 'src/test/utils/themeUtils'
const Theme = testingThemeStyles

const mockUser = FactoryUser({ country: '' })

jest.mock('src/index', () => {
  return {
    useCommonStores: () => ({
      stores: {
        userStore: {
          fetchAllVerifiedUsers: jest.fn(),
          getUserByUsername: jest.fn().mockResolvedValue(mockUser),
        },
      },
    }),
  }
})

jest.mock('./ResearchComments/ResearchComments', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __esModule: true,
  ResearchComments: () => <>Mocked Research Comments</>,
}))

describe('ResearchUpdate', () => {
  it('does not show edit timestamp, when create displays the same value', () => {
    const created = faker.date.past()
    const modified = new Date(created)
    modified.setHours(15)
    const update = FactoryResearchItemUpdate({
      _created: created.toString(),
      _modified: modified.toString(),
      title: 'A title',
      description: 'A description',
    })

    // Act
    const wrapper = getWrapper(update)

    // Assert
    expect(() =>
      wrapper.getAllByText(`edited ${format(modified, 'DD-MM-YYYY')}`),
    ).toThrow()
  })

  it('does show both created and edit timestamp, when different', () => {
    const modified = faker.date.past()
    const update = FactoryResearchItemUpdate({
      _modified: modified.toString(),
      title: 'A title',
      description: 'A description',
    })

    // Act
    const wrapper = getWrapper(update)

    // Assert
    expect(() =>
      wrapper.getAllByText(`edited ${format(modified, 'DD-MM-YYYY')}`),
    ).not.toThrow()
  })
})

const getWrapper = (update) => {
  return render(
    <ThemeProvider theme={Theme}>
      <ResearchUpdate
        update={update}
        updateIndex={1}
        slug={'slug'}
        comments={[]}
        isEditable={false}
        showComments={false}
      />
    </ThemeProvider>,
  )
}
