import { observer } from 'mobx-react'
import { useAdminStore } from '../admin.store'

const AdminUserDetail = observer(() => {
  const adminStore = useAdminStore()
  return (
    <>
      <h2>Admin User Detail</h2>
    </>
  )
})
export default AdminUserDetail
