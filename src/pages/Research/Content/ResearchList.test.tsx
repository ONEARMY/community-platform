import { fireEvent, render, within } from '@testing-library/react'
import ResearchList from './ResearchList'
import { Provider } from 'mobx-react'
import { ThemeProvider } from '@theme-ui/core'
import { MemoryRouter } from 'react-router'
import { Route } from 'react-router-dom'
import { testingThemeStyles } from 'src/test/utils/themeUtils'
import { FactoryUser } from 'src/test/factories/User'
import { useResearchList } from './ResearchList.hooks'
jest.mock('./ResearchList.hooks')
import {
  FactoryResearchItem,
  FactoryResearchItemUpdate,
} from 'src/test/factories/ResearchItem'
import { FactoryComment } from 'src/test/factories/Comment'
jest.mock('src/stores/Research/research.store')

const Theme = testingThemeStyles

const mockUser = FactoryUser({ country: 'nl' })

jest.mock('src/index', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __esModule: true,
  useCommonStores: () => ({
    stores: {
      userStore: {
        getUserByUsername: jest.fn().mockImplementation(() => {
          return Promise.resolve(mockUser)
        }),
      },
      aggregationsStore: {
        aggregations: {},
      },
      researchCategoriesStore: {
        allResearchCategories: [
          {
            label: 'Research category',
          },
        ],
      },
    },
  }),
}))

describe('ResearchList', () => {
  it('should handle empty list of research', () => {
    ;(useResearchList as jest.Mock).mockReturnValue({
      isLoading: false,
      fullResearchListItems: [],
    })
    const wrapper = getWrapper()
    expect(wrapper.getByText('No research to show')).toBeInTheDocument()
  })

  it('should handle list of research articles', () => {
    ;(useResearchList as jest.Mock).mockReturnValue({
      isLoading: false,
      fullResearchListItems: [
        {
          author: {
            userName: 'testUsername',
            countryCode: 'nl',
            isVerified: true,
          },
          ...FactoryResearchItem({
            title: 'Research Article 1',
          }),
        },
      ],
    })
    const wrapper = getWrapper()
    expect(wrapper.getByText('Research Article 1')).toBeInTheDocument()
    expect(wrapper.container.querySelector('.flag-icon-nl')).toBeInTheDocument()
    expect(wrapper.getByText('testUsername')).toBeInTheDocument()
  })

  it('should support filtering by category', async () => {
    ;(useResearchList as jest.Mock).mockReturnValue({
      isLoading: false,
      fullResearchListItems: [
        FactoryResearchItem({
          title: 'Research Article 1',
        }),
        FactoryResearchItem({
          title: 'Research Article 2',
          researchCategory: {
            label: 'Research category',
          } as any,
        }),
      ],
      setResearchListItems: jest.fn(),
    })

    // Act
    const wrapper = getWrapper()

    // Select category
    const selectElement = wrapper.getByText('Filter by category')
    fireEvent.mouseDown(selectElement)
    const option = wrapper.getByText('Research category')
    fireEvent.click(option)

    expect(() => wrapper.getByText('Research Article 1')).toThrow()
    expect(wrapper.getByText('Research Article 2')).toBeInTheDocument()
  })

  it('sorts by comments attribute', async () => {
    ;(useResearchList as jest.Mock).mockReturnValue({
      isLoading: false,
      fullResearchListItems: [
        FactoryResearchItem({
          title: 'Research Article 1',
          updates: [
            FactoryResearchItemUpdate({
              comments: [FactoryComment()],
            }),
          ],
        }),
        FactoryResearchItem({
          title: 'Research Article 2',
          updates: [
            FactoryResearchItemUpdate({
              comments: [FactoryComment(), FactoryComment()],
            }),
          ],
        }),
      ],
      setResearchListItems: jest.fn(),
    })

    // Act
    const wrapper = getWrapper()

    // Set sort order
    const selectElement = wrapper.getByText('Sort by')
    fireEvent.mouseDown(selectElement)
    const option = wrapper.getByText('Comments')
    fireEvent.click(option)

    // Assert
    const researchItems = wrapper.container.querySelectorAll(
      '[data-cy="ResearchListItem"]',
    )

    expect(
      within(researchItems[1]).getByText('Research Article 1'),
    ).toBeInTheDocument()
  })
})

const getWrapper = () => {
  return render(
    <Provider
      userStore={{
        user: FactoryUser(),
      }}
    >
      <ThemeProvider theme={Theme}>
        <MemoryRouter initialEntries={['/research']}>
          <Route path="/research" exact key={1} component={ResearchList} />
        </MemoryRouter>
      </ThemeProvider>
    </Provider>,
  )
}
