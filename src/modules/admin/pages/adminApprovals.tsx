import { observer } from 'mobx-react'
import { useCallback, useEffect, useState } from 'react'
import { Box, Heading } from 'theme-ui'
import type { IDBEndpoint, IHowto, IMapPin, IUserDB } from 'src/models'
import styled from '@emotion/styled'
// TODO: Remove direct usage of Theme
import { preciousPlasticTheme } from 'oa-themes'
const theme = preciousPlasticTheme.styles
import { useHistory } from 'react-router'
import { useAdminStoreV2 } from '../admin.storeV2'

interface IPendingApprovals {
  mappins: IMapPin[]
  howtos: IHowto[]
  users?: IUserDB[]
}

const endpoints: IDBEndpoint[] = ['mappins', 'howtos']

const Divider = styled('hr')`
  border: 2px solid black;
`

const ContentTable = styled('table')`
  border-collapse: separate;
  border-spacing: 0 8px;
  table-layout: fixed;
  width: 100%;
`

const ContentRow = styled('tr')`
  background: white;
  &:hover {
    cursor: pointer;
    background: ${theme.colors.yellow.hover};
  }
  & > td {
    padding: 8px;
    border-top: 2px solid black;
    border-bottom: 2px solid black;
  }
  & > td:first-of-type {
    border-left: 2px solid black;
    border-radius: 5px 0 0 5px;
  }
  & > td:last-of-type {
    border-right: 2px solid black;
    border-radius: 0 5px 5px 0;
  }
`

const AdminHome = observer(() => {
  const adminStore = useAdminStoreV2()
  const [pending, setPending] = useState<IPendingApprovals>({} as any)
  const history = useHistory()

  const getApprovals = useCallback(async () => {
    const approvals: IPendingApprovals = {} as any
    for (const endpoint of endpoints) {
      const pendingApprovals = await adminStore.getPendingApprovals(endpoint)
      approvals[endpoint] = pendingApprovals
    }
    setPending(approvals)
  }, [])

  // Load list of pending approvals on mount only, dependencies empty to avoid reloading
  useEffect(() => {
    getApprovals()
  }, [])
  return (
    <>
      <Heading my={9}>Pending Content Approvals</Heading>
      {/* Map Pins */}
      {pending.mappins && (
        <Box mb={4}>
          <Heading variant="small">Map Pins {pending.mappins.length}</Heading>
          <Divider />
          <ContentTable style={{ textAlign: 'left', width: '100%' }}>
            <thead>
              <tr>
                <th>Type</th>
                <th>Username</th>
              </tr>
            </thead>
            <tbody>
              {pending.mappins.map((p) => (
                <ContentRow
                  key={p._id}
                  onClick={() => history.push(`/map#${p._id}`)}
                >
                  <td>{p.type}</td>
                  <td>{p._id}</td>
                </ContentRow>
              ))}
            </tbody>
          </ContentTable>
        </Box>
      )}
      {/* Howtos */}
      {pending.howtos && (
        <Box mb={4}>
          <Heading variant="small">HowTos {pending.howtos.length}</Heading>
          <Divider />
          <ContentTable style={{ textAlign: 'left', width: '100%' }}>
            <thead>
              <tr>
                <th>Author</th>
                <th>Title</th>
              </tr>
            </thead>
            <tbody>
              {pending.howtos.map((p) => (
                <ContentRow
                  key={p._id}
                  onClick={() => history.push(`/how-to/${p.slug}`)}
                >
                  <td>{p._createdBy}</td>
                  <td>{p.title}</td>
                </ContentRow>
              ))}
            </tbody>
          </ContentTable>
        </Box>
      )}
      {/* Users (not currently used) */}
      {pending.users && (
        <Box mb={4}>
          <Heading variant="small">Users {pending.users.length}</Heading>
          <Divider />
          <ContentTable style={{ textAlign: 'left', width: '100%' }}>
            <thead>
              <tr>
                <th>Type</th>
                <th>Username</th>
              </tr>
            </thead>
            <tbody>
              {pending.users.map((p) => (
                <ContentRow
                  key={p._id}
                  onClick={() => history.push(`/u/${p.userName}`)}
                >
                  <td></td>
                  <td>{p.userName}</td>
                </ContentRow>
              ))}
            </tbody>
          </ContentTable>
        </Box>
      )}
    </>
  )
})
export default AdminHome
