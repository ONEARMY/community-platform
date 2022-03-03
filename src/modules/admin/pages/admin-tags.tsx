import { observer } from 'mobx-react'
import { useAdminStore } from '../admin.store'

const AdminTags = observer(() => {
  const adminStore = useAdminStore()
  return (
    <>
      <h2>Admin Tags</h2>
    </>
  )
})
export default AdminTags
