import { observer } from 'mobx-react'
import { useAdminStore } from '../admin.store'

const AdminUsers = observer(() => {
  const adminStore = useAdminStore()
  return (
    <>
      <h2>Admin Users</h2>
    </>
  )
})
export default AdminUsers
