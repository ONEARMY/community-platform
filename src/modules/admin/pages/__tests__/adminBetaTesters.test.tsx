import { act, fireEvent, render } from '@testing-library/react'
import AdminBetaTesters from '../adminBetaTesters'

import { Provider } from 'mobx-react'

const betaTesters = [{ userName: 'user1' }, { userName: 'user2' }]
const mockAddUserRole = jest.fn()
const mockRemoveUserRole = jest.fn()

jest.mock('src/index', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __esModule: true,
  useCommonStores: () => ({
    stores: {
      adminStore: {
        betaTesters,
        init: jest.fn(),
        addUserRole: mockAddUserRole,
        removeUserRole: mockRemoveUserRole,
      },
    },
  }),
}))

const factory = (role = 'admin') => {
  return (
    <Provider userStore={{ user: { userRoles: [role] } }}>
      <AdminBetaTesters />
    </Provider>
  )
}

describe('AdminBetaTesters', () => {
  it('allows adding a new beta tester', async () => {
    const { getByPlaceholderText, getByText } = render(factory())

    const field = getByPlaceholderText('Username')

    fireEvent.change(field, { target: { value: 'Newbetatester' } })

    await act(async () => {
      fireEvent.click(getByText('Add beta tester'))
    })

    expect(mockAddUserRole).toHaveBeenLastCalledWith(
      'Newbetatester',
      'beta-tester',
    )
  })

  it('allows removing of a role', async () => {
    const { getByTestId } = render(factory())

    const removeButton = getByTestId('remove-role-user1')

    await act(async () => {
      fireEvent.click(removeButton)
    })

    expect(mockRemoveUserRole).toHaveBeenLastCalledWith('user1', 'beta-tester')
  })

  describe('when the current user is not an admin', () => {
    it('does not allow removing of a role', () => {
      const { queryByTestId } = render(factory('beta-tester'))

      expect(queryByTestId('remove-role-user1')).toBeNull()
    })
  })

  describe('when adding a role fails', () => {
    it('displays an error message', async () => {
      const { queryByText, getByPlaceholderText, getByText } = render(factory())

      expect(queryByText('THE ERROR')).toBeNull()
      mockAddUserRole.mockImplementation(() => {
        throw new Error('THE ERROR')
      })

      const field = getByPlaceholderText('Username')

      fireEvent.change(field, { target: { value: 'Newbetatester' } })

      await act(async () => {
        fireEvent.click(getByText('Add beta tester'))
      })

      expect(queryByText('THE ERROR')).toBeTruthy()
    })
  })

  describe('when removing a role fails', () => {
    it('displays an error message', async () => {
      const { queryByText, getByTestId } = render(factory())

      expect(queryByText('THE ERROR')).toBeNull()
      mockRemoveUserRole.mockImplementation(() => {
        throw new Error('THE ERROR')
      })

      const removeButton = getByTestId('remove-role-user1')

      await act(async () => {
        fireEvent.click(removeButton)
      })

      expect(queryByText('THE ERROR')).toBeTruthy()
    })
  })
})
