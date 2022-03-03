import { observer } from 'mobx-react'
import { useAdminStore } from '../admin.store'

const AdminHowtos = observer(() => {
  const adminStore = useAdminStore()
  return (
    <>
      <h2>Admin Howtos</h2>
    </>
  )
})
export default AdminHowtos
