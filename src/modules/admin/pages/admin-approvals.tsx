import { observer } from 'mobx-react'
import { useAdminStore } from '../admin.store'

const AdminHome = observer(() => {
  const adminStore = useAdminStore()
  return (
    <>
      <h2>Pending Content Approvals</h2>
    </>
  )
})
export default AdminHome
