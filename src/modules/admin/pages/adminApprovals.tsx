import { observer } from 'mobx-react'
import { useCallback, useEffect, useState } from 'react'
import { Box } from 'theme-ui'
import { useDB } from 'src/App'
import type { IDBEndpoint, IHowto, IMapPin } from 'src/models'
import type { DatabaseV2 } from 'src/stores/databaseV2'
import styled from '@emotion/styled'
import theme from 'src/themes/styled.theme'
import { useHistory } from 'react-router'
import Heading from 'src/components/Heading'

interface IPendingApprovals {
  mappins: IMapPin[]
  howtos: IHowto[]
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
  const { db } = useDB()
  const [pending, setPending] = useState<IPendingApprovals>({} as any)
  const history = useHistory()

  const getApprovals = useCallback(async () => {
    const approvals: IPendingApprovals = {} as any
    for (const endpoint of endpoints) {
      const pendingApprovals = await getPendingApprovals(endpoint, db)
      approvals[endpoint] = pendingApprovals
    }
    console.log('allPending', approvals)
    setPending(approvals)
  }, [])

  useEffect(() => {
    getApprovals()
  }, [])
  return (
    <>
      <Heading medium bold txtcenter sx={{ width: '100%' }} py={26}>
        Pending Content Approvals
      </Heading>
      {/* Users - TODO (confirm if required)*/}
      {/* {pending.users && (
        <Box mb={4}>
          <Heading small>Users {pending.users.length}</Heading>
          <Divider />
          <ContentTable style={{ textAlign: 'left', width: '100%' }}>
            <thead>
              <tr>
                <th>Type</th>
                <th>Username</th>
              </tr>
            </thead>
            <tbody>
              {pending.users.map(p => (
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
      )} */}
      {/* Map Pins */}
      {pending.mappins && (
        <Box mb={4}>
          <Heading small>Map Pins {pending.mappins.length}</Heading>
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
          <Heading small>HowTos {pending.howtos.length}</Heading>
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
    </>
  )
})
export default AdminHome

/** Query database for documents pending moderation */
async function getPendingApprovals(
  endpoint: IDBEndpoint,
  dbClient: DatabaseV2,
) {
  return dbClient
    .collection(endpoint)
    .getWhere('moderation', '==', 'awaiting-moderation')

  /** Alt syntax via raw firestore TODO - decide if required (likely if multiple where chains) */
  // const db = (dbClient.clients.serverDB as FirestoreClient)._raw // <-- will need to be exposed
  // const mappedEndpoint = DB_ENDPOINTS[endpoint]
  // const res = await db
  //   .collection(mappedEndpoint)
  //   .where('moderation', '==', 'awaiting-moderation')
  //   // .limit(10)
  //   .get()
  // return res.docs.map(d => d.data())
}
