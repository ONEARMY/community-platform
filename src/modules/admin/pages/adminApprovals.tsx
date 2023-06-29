import { observer } from 'mobx-react'
import { useCallback, useEffect, useState } from 'react'
import { Box, Heading, Divider } from 'theme-ui'
import type { IDBEndpoint, IHowto, IMapPin, IUserDB } from 'src/models'
import { useHistory } from 'react-router'
import { useAdminStoreV2 } from '../admin.storeV2'

interface IPendingApprovals {
  mappins: IMapPin[]
  howtos: IHowto[]
  users?: IUserDB[]
}

const endpoints: IDBEndpoint[] = ['mappins', 'howtos']

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
  const _tableStyle = {
    textAlign: 'left',
    borderCollapse: 'separate',
    borderSpacing: '0 8px',
    tableLayout: 'fixed',
    width: '100%',
  } as React.CSSProperties

  const _trStyle = {
    background: 'white',
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: 'accent.hover',
    },
    '& > td': {
      padding: '8px',
      borderTop: '2px solid black',
      borderBottom: '2px solid black',

      '&:first-of-type': {
        borderLeft: '2px solid black',
        borderRadius: '5px 0 0 5px',
      },
      '&:last-of-type': {
        borderRight: '2px solid black',
        borderRadius: '0 5px 5px 0',
      },
    },
  }
  return (
    <>
      <Heading my={9}>Pending Content Approvals</Heading>
      {/* Map Pins */}
      {pending.mappins && (
        <Box mb={4}>
          <Heading variant="small">Map Pins {pending.mappins.length}</Heading>
          <Divider
            sx={{
              border: '2px solid black',
            }}
          />
          <table style={_tableStyle}>
            <thead>
              <tr>
                <th>Type</th>
                <th>Username</th>
              </tr>
            </thead>
            <tbody>
              {pending.mappins.map((p) => (
                <Box
                  as="tr"
                  sx={_trStyle}
                  key={p._id}
                  onClick={() => history.push(`/map#${p._id}`)}
                >
                  <td>{p.type}</td>
                  <td>{p._id}</td>
                </Box>
              ))}
            </tbody>
          </table>
        </Box>
      )}
      {/* Howtos */}
      {pending.howtos && (
        <Box mb={4}>
          <Heading variant="small">HowTos {pending.howtos.length}</Heading>
          <Divider />
          <table style={_tableStyle}>
            <thead>
              <tr>
                <th>Author</th>
                <th>Title</th>
              </tr>
            </thead>
            <tbody>
              {pending.howtos.map((p) => (
                <Box
                  as="tr"
                  sx={_trStyle}
                  key={p._id}
                  onClick={() => history.push(`/how-to/${p.slug}`)}
                >
                  <td>{p._createdBy}</td>
                  <td>{p.title}</td>
                </Box>
              ))}
            </tbody>
          </table>
        </Box>
      )}
      {/* Users (not currently used) */}
      {pending.users && (
        <Box mb={4}>
          <Heading variant="small">Users {pending.users.length}</Heading>
          <Divider />
          <table style={_tableStyle}>
            <thead>
              <tr>
                <th>Type</th>
                <th>Username</th>
              </tr>
            </thead>
            <tbody>
              {pending.users.map((p) => (
                <Box
                  as="tr"
                  sx={_trStyle}
                  key={p._id}
                  onClick={() => history.push(`/u/${p.userName}`)}
                >
                  <td></td>
                  <td>{p.userName}</td>
                </Box>
              ))}
            </tbody>
          </table>
        </Box>
      )}
    </>
  )
})
export default AdminHome
