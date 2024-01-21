import {
  createMemoryRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom'
import { ThemeProvider } from '@emotion/react'
import { faker } from '@faker-js/faker'
import { render } from '@testing-library/react'
import { FactoryResearchItemUpdate } from 'src/test/factories/ResearchItem'
import { FactoryUser } from 'src/test/factories/User'
import { testingThemeStyles } from 'src/test/utils/themeUtils'
import { formatDate } from 'src/utils/date'

import ResearchUpdate from './ResearchUpdate'

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
      wrapper.getAllByText(`edited ${formatDate(modified)}`),
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
      wrapper.getAllByText(`edited ${formatDate(modified)}`),
    ).not.toThrow()
  })
})

const getWrapper = (update) => {
  const router = createMemoryRouter(
    createRoutesFromElements(
      <Route
        path="/research/test/edit"
        element={
          <ResearchUpdate
            update={update}
            updateIndex={1}
            slug={'slug'}
            comments={[]}
            isEditable={false}
            showComments={false}
          />
        }
      />,
    ),
    {
      initialEntries: ['/research/test/edit'],
    },
  )

  return render(
    <ThemeProvider theme={Theme}>
      <RouterProvider router={router} />
    </ThemeProvider>,
  )
}
