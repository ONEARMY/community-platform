import { format } from 'date-fns'
import { ThemeProvider } from '@theme-ui/core'
import { render } from '@testing-library/react'
import Theme from 'src/themes/styled.theme'
import ResearchUpdate from './ResearchUpdate'
import { faker } from '@faker-js/faker'

jest.mock('src/index', () => {
  return {
    useCommonStores: jest.fn().mockReturnValue({
      stores: { userStore: { fetchAllVerifiedUsers: jest.fn() } },
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

    const wrapper = render(
      <ThemeProvider theme={Theme}>
        <ResearchUpdate
          update={{
            _id: faker.database.mongodbObjectId(),
            _deleted: false,
            _created: created.toString(),
            _modified: modified.toString(),
            title: 'A title',
            description: 'A description',
            images: [],
            comments: [],
          }}
          updateIndex={1}
          slug={'slug'}
          comments={[]}
          isEditable={false}
          showComments={false}
        />
      </ThemeProvider>,
    )

    expect(() =>
      wrapper.getAllByText(`edited ${format(modified, 'DD-MM-YYYY')}`),
    ).toThrow()
  })

  it('does show both created and edit timestamp, when different', () => {
    const modified = faker.date.past()
    const wrapper = render(
      <ThemeProvider theme={Theme}>
        <ResearchUpdate
          update={{
            _id: faker.database.mongodbObjectId(),
            _deleted: false,
            _created: faker.date.past().toString(),
            _modified: modified.toString(),
            title: 'A title',
            description: 'A description',
            images: [],
            comments: [],
          }}
          updateIndex={1}
          slug={'slug'}
          comments={[]}
          isEditable={false}
          showComments={false}
        />
      </ThemeProvider>,
    )

    expect(() =>
      wrapper.getAllByText(`edited ${format(modified, 'DD-MM-YYYY')}`),
    ).not.toThrow()
  })
})
