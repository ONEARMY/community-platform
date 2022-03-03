import { observer } from 'mobx-react'
import { useAdminStore } from '../admin.store'

const AdminResearchDetail = observer(() => {
  const adminStore = useAdminStore()
  return (
    <>
      <h2>Admin Research Detail</h2>
    </>
  )
})
export default AdminResearchDetail
