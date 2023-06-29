import { render, fireEvent, act } from '@testing-library/react'
import AdminCategories from '../adminCategories'

const allCategories = [
  { _id: 'how_to_1_id', label: 'How to 1' },
  { _id: 'how_to_2_id', label: 'How to 2' },
]

const allResearchCategories = [
  { _id: 'research_1_id', label: 'Research 1' },
  { _id: 'research_2_id', label: 'Research 2' },
]

const mockSaveCategory = jest.fn()
const mockSaveResearchCategory = jest.fn()
const mockDeleteCategory = jest.fn()
const mockDeleteResearchCategory = jest.fn()

jest.mock('src/index', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __esModule: true,
  useCommonStores: () => ({
    stores: {
      categoriesStore: {
        allCategories,
        saveCategory: mockSaveCategory,
        deleteCategory: mockDeleteCategory,
      },
      researchCategoriesStore: {
        allResearchCategories,
        saveResearchCategory: mockSaveResearchCategory,
        deleteResearchCategory: mockDeleteResearchCategory,
      },
    },
  }),
}))

describe('AdminCategories', () => {
  ;[
    {
      type: 'how-to',
      label: 'How-to',
      categories: allCategories,
      save: mockSaveCategory,
      deleteCategory: mockDeleteCategory,
    },
    {
      type: 'research',
      label: 'Research',
      categories: allResearchCategories,
      save: mockSaveResearchCategory,
      deleteCategory: mockDeleteResearchCategory,
    },
  ].forEach(({ type, label, categories, save, deleteCategory }) => {
    describe(label, () => {
      const formId = `${type}-category-form`

      it('renders each category', () => {
        const { getByText } = render(<AdminCategories />)

        categories.forEach(({ _id, label }) => {
          expect(getByText(_id).textContent).toBeTruthy()
          expect(getByText(label).textContent).toBeTruthy()
        })
      })

      it(`allows adding a new ${type} category`, async () => {
        const { getByText, queryByTestId, getByLabelText } = render(
          <AdminCategories />,
        )

        expect(queryByTestId(formId)).toBeNull()

        fireEvent.click(getByText(`Add ${label} Category`))

        // Verify that the modal opens
        expect(queryByTestId(formId)).toBeTruthy()

        fireEvent.change(getByLabelText('Label name:'), {
          target: { value: 'New category' },
        })

        await act(async () => {
          fireEvent.click(getByText('Save'))
        })

        expect(queryByTestId(formId)).toBeNull()

        expect(save).toHaveBeenLastCalledWith({
          _id: undefined,
          label: 'New category',
        })
      })

      it(`allows the editing of a ${type} category`, async () => {
        const { getByText, queryByTestId, getByLabelText } = render(
          <AdminCategories />,
        )

        expect(queryByTestId(formId)).toBeNull()

        fireEvent.click(getByText(categories[0]._id))

        // Verify that the modal opens
        expect(queryByTestId(formId)).toBeTruthy()

        fireEvent.change(getByLabelText('Label name:'), {
          target: { value: 'Updated category' },
        })

        await act(async () => {
          fireEvent.click(getByText('Save'))
        })

        expect(queryByTestId(formId)).toBeNull()

        expect(save).toHaveBeenLastCalledWith({
          _id: categories[0]._id,
          label: 'Updated category',
        })
      })

      it(`allows the deleting of a ${type} category`, async () => {
        const { getByText, queryByTestId } = render(<AdminCategories />)

        expect(queryByTestId(formId)).toBeNull()

        fireEvent.click(getByText(categories[0]._id))

        // Verify that the modal opens
        expect(queryByTestId(formId)).toBeTruthy()

        await act(async () => {
          fireEvent.click(getByText('Delete'))
        })

        expect(queryByTestId(formId)).toBeNull()

        expect(deleteCategory).toHaveBeenLastCalledWith(categories[0])
      })
    })
  })
})
