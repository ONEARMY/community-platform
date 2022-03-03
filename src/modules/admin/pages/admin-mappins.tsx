import { observer } from 'mobx-react'
import { useAdminStore } from '../admin.store'

const AdminMappins = observer(() => {
  const adminStore = useAdminStore()
  return (
    <>
      <h2>Admin Mappins</h2>
    </>
  )
})
export default AdminMappins
