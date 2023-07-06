import { act, fireEvent, render } from '@testing-library/react'
import AdminAdminUsers from '../adminAdminUsers'

import { Provider } from 'mobx-react'

const admins = [{ userName: 'admin1' }, { userName: 'admin2' }]
const superAdmins = [{ userName: 'superadmin1' }, { userName: 'superadmin2' }]

const mockAddUserRole = jest.fn()
const mockRemoveUserRole = jest.fn()

jest.mock('src/index', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __esModule: true,
  useCommonStores: () => ({
    stores: {
      adminStore: {
        admins,
        superAdmins,
        init: jest.fn(),
        addUserRole: mockAddUserRole,
        removeUserRole: mockRemoveUserRole,
      },
    },
  }),
}))

const factory = (role = 'super-admin') => {
  return (
    <Provider userStore={{ user: { userRoles: [role] } }}>
      <AdminAdminUsers />
    </Provider>
  )
}

describe('AdminAdminUsers', () => {
  it('allows adding a new admin user', async () => {
    const { getByPlaceholderText, getByText } = render(factory())

    const field = getByPlaceholderText('Username')

    fireEvent.change(field, { target: { value: 'Newadminuser' } })

    await act(async () => {
      fireEvent.click(getByText('Add admin'))
    })

    expect(mockAddUserRole).toHaveBeenLastCalledWith('Newadminuser', 'admin')
  })

  it('allows removing of a role', async () => {
    const { getByTestId } = render(factory())

    const removeButton = getByTestId('remove-role-admin1')

    await act(async () => {
      fireEvent.click(removeButton)
    })

    expect(mockRemoveUserRole).toHaveBeenLastCalledWith('admin1', 'admin')
  })

  describe('when the current user is not a super admin', () => {
    it('does not allow removing of a role', () => {
      const { queryByTestId } = render(factory('admin'))

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

      fireEvent.change(field, { target: { value: 'Newadminuser' } })

      await act(async () => {
        fireEvent.click(getByText('Add admin'))
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

      const removeButton = getByTestId('remove-role-admin1')

      await act(async () => {
        fireEvent.click(removeButton)
      })

      expect(queryByText('THE ERROR')).toBeTruthy()
    })
  })
})
