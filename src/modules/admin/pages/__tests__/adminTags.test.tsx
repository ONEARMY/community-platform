import { render, fireEvent, act } from '@testing-library/react'
import AdminTags, { ERRORS } from '../adminTags'

const allTags = [
  { _id: 'tag_1_id', label: 'Tag 1', categories: ['how-to'] },
  { _id: 'tag_2_id', label: 'Tag 2', categories: ['event'] },
]
const mockSaveTag = jest.fn()

jest.mock('src/index', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __esModule: true,
  useCommonStores: () => ({
    stores: {
      tagsStore: {
        allTags,
        saveTag: mockSaveTag,
      },
    },
  }),
}))

describe('AdminTags', () => {
  it('allows adding a new tag', async () => {
    const { getByText, queryByTestId, getByLabelText } = render(<AdminTags />)

    expect(queryByTestId('tag-form')).toBeNull()

    fireEvent.click(getByText('Add Tag'))

    // Verify that the modal opens
    expect(queryByTestId('tag-form')).toBeTruthy()

    fireEvent.change(getByLabelText('Label name:'), {
      target: { value: 'New tag' },
    })
    fireEvent.change(getByLabelText('Categories:'), {
      target: { value: ['how-to'] },
    })

    await act(async () => {
      fireEvent.click(getByText('Save'))
    })

    expect(queryByTestId('tag-form')).toBeNull()

    expect(mockSaveTag).toHaveBeenLastCalledWith({
      _id: undefined,
      categories: ['how-to'],
      label: 'New tag',
    })
  })

  it('renders each tag', () => {
    const { getByTestId } = render(<AdminTags />)

    allTags.forEach(({ _id, label, categories }) => {
      expect(getByTestId(`${_id}-_id`).textContent).toEqual(_id)
      expect(getByTestId(`${_id}-label`).textContent).toEqual(label)
      expect(getByTestId(`${_id}-categories`).textContent).toEqual(
        categories.join(' '),
      )
    })
  })

  it('allows the editing of a tag', async () => {
    const { getByText, queryByTestId, getByTestId, getByLabelText } = render(
      <AdminTags />,
    )

    expect(queryByTestId('tag-form')).toBeNull()

    fireEvent.click(getByTestId('tag_1_id-_id'))

    // Verify that the modal opens
    expect(queryByTestId('tag-form')).toBeTruthy()

    fireEvent.change(getByLabelText('Label name:'), {
      target: { value: 'Updated tag' },
    })
    fireEvent.change(getByLabelText('Categories:'), {
      target: { value: ['how-to'] },
    })

    await act(async () => {
      fireEvent.click(getByText('Save'))
    })

    expect(queryByTestId('tag-form')).toBeNull()

    expect(mockSaveTag).toHaveBeenLastCalledWith({
      _id: 'tag_1_id',
      categories: ['how-to'],
      label: 'Updated tag',
    })
  })

  it('renders errors for invalid fields', async () => {
    const { queryByText, getByTestId, getByLabelText } = render(<AdminTags />)

    fireEvent.click(getByTestId('tag_1_id-_id'))

    expect(queryByText(ERRORS.label)).toBeNull()
    fireEvent.change(getByLabelText('Label name:'), {
      target: { value: null },
    })

    expect(queryByText(ERRORS.label)).toBeTruthy()

    expect(queryByText(ERRORS.categories)).toBeNull()
    fireEvent.change(getByLabelText('Categories:'), {
      target: { value: [] },
    })
    expect(queryByText(ERRORS.label)).toBeTruthy()
  })
})
