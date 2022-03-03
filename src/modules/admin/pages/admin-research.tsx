import { observer } from 'mobx-react'
import { useAdminStore } from '../admin.store'

const AdminResearch = observer(() => {
  const adminStore = useAdminStore()
  return (
    <>
      <h2>Admin Research </h2>
    </>
  )
})
export default AdminResearch
