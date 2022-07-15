import { Box, Text } from 'theme-ui'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import Table from '../components/Table/Table'
import type { ITableProps, ICellRenderProps } from '../components/Table/Table'
import HeadFilter from '../components/Table/HeadFilter'
import { observer } from 'mobx-react'
import { useCommonStores } from 'src/index'
import type { IUserPPDB } from 'src/models'
import Fuse from 'fuse.js'
import { Loader, MemberBadge } from 'oa-components'
import AdminUserSearch from '../components/adminUserSearch'
import { Link } from 'react-router-dom'

const TABLE_COLUMNS: ITableProps<IUserPPDB>['columns'] = [
  {
    Header: 'Type',
    accessor: 'profileType',
    minWidth: 140,
  },
  {
    Header: 'Username',
    accessor: 'userName',
    minWidth: 140,
  },
  {
    Header: 'Signup Date',
    accessor: '_created',
    minWidth: 135,
  },
  {
    Header: 'Roles',
    accessor: 'userRoles',
    minWidth: 140,
  },
  {
    Header: 'Badges',
    accessor: 'badges',
    minWidth: 140,
  },
]

interface Props {
  val: string
}

const types = [
  'member',
  'workspace',
  'machine-builder',
  'community-builder',
  'collection-point',
]

const roles = ['user', 'beta-tester', 'admin']

const AdminUsers = observer(() => {
  const { stores } = useCommonStores()
  const [data, setData] = useState<IUserPPDB[]>([])
  const [filteredData, setFilteredData] = useState<IUserPPDB[]>([])
  const [filterBy, setFilterBy] = useState<string[]>([])
  const [open, setopen] = useState<boolean>(false)
  const [toOpen, settoOpen] = useState('')

  // Create placeholder fuse instance to power search feature
  const fuseOptions = { keys: ['userName'] }
  const [fuse] = useState<Fuse<IUserPPDB>>(
    new Fuse([], { keys: fuseOptions.keys }),
  )

  const [loading, setLoading] = useState(false)
  useEffect(() => {
    loadUserData()
  }, [])

  useEffect(() => {
    if (filterBy.length > 0) filterByType()
    else setFilteredData(data)
  }, [filterBy])

  const loadUserData = async () => {
    setLoading(true)
    try {
      const usersdata = await stores.userStore.getAllUser()
      setData(usersdata)
      setFilteredData(usersdata)
      // update search data data for use in local search
      const index = Fuse.createIndex(fuseOptions.keys, usersdata)
      fuse.setCollection(usersdata, index)
    } catch (error) {
      console.log({ error })
    }
    setLoading(false)
  }

  const filterByType = () => {
    const filterRoles: Array<string> = []
    const types: Array<string> = []
    for (let i = 0; i < filterBy.length; i++) {
      if (filterBy[i].includes('Roles-')) {
        filterRoles.push(filterBy[i].replace('Roles-', ''))
      } else {
        types.push(filterBy[i].replace('Type-', ''))
      }
    }
    const filteredTypes: IUserPPDB[] = []
    ;(types.length > 0 || filterRoles.length > 0) &&
      data.map((it) => {
        if (types.includes(it.profileType)) {
          filteredTypes.push(it)
        }
        if (it?.userRoles && it?.userRoles.length) {
          const intersection = filterRoles.filter((element: any) =>
            it?.userRoles?.includes(element),
          )
          if (intersection.length) {
            filteredTypes.push(it)
          }
        }
      })
    setFilteredData(filteredTypes)
  }

  const RenderFilter: React.FC<Props> = (props: Props) => {
    const { val } = props
    if (val === 'Type' || val === 'Roles') {
      const filter = val === 'Type' ? types : roles
      return (
        <HeadFilter
          val={val}
          filter={filter}
          setFilterBy={setFilterBy}
          filterBy={filterBy}
          open={open}
          setopen={setopen}
          toOpen={toOpen}
          settoOpen={settoOpen}
        />
      )
    } else {
      return <></>
    }
  }

  const getProfileTypeImage = (type?: string) => {
    return type ? <MemberBadge profileType={type} /> : null
  }

  /**
   * Default function used to render the value of a cell
   * Displays arrays as bullet list, stringified json, '-'
   */
  const defaultValueRenderer = (value: any) => {
    if (typeof value === 'object') {
      // null and undefined
      if (!value) {
        return '-'
      }
      // arrays
      if (Array.isArray(value)) {
        return (
          <ul>
            {value.map((v) => (
              <li key={v}>{v}</li>
            ))}
          </ul>
        )
      }
      // objects
      value = JSON.stringify(value, null, 2)
    }
    // string, boolean, number
    return <Text>{value}</Text>
  }

  /** Function applied to render each table row cell */
  const RenderContent: React.FC<ICellRenderProps> = (
    props: ICellRenderProps,
  ) => {
    const { col } = props
    const { field, value } = col
    const userField = field as keyof IUserPPDB
    if (value) {
      if (userField === 'profileType') {
        const type = value?.toString()
        return getProfileTypeImage(type) as any
      }
      if (userField === '_created') {
        return format(new Date(value?.toString()), 'DD-MM-YYYY')
      }
      if (userField === 'badges') {
        const badges = Object.entries(value)
          .filter(([, value]) => !!value)
          .map(([key]) => key)
        return defaultValueRenderer(badges)
      }
      if (userField === 'userName') {
        return <Link to={`/u/${value}/edit`}>{value}</Link>
      }
    }
    return defaultValueRenderer(value)
  }

  const handleSearchChange = (val: string) => {
    // Change the pattern
    if (!val) {
      setFilteredData(data)
      return
    }
    const filteredData = fuse.search(val).map((it) => it.item)
    setFilteredData(filteredData)
  }

  return (
    <Box sx={{ width: '100%', mt: 5 }}>
      <AdminUserSearch
        total={filteredData.length}
        onSearchChange={handleSearchChange}
      />
      {!loading ? (
        <Table
          data={filteredData}
          columns={TABLE_COLUMNS}
          filters={RenderFilter}
          rowComponent={RenderContent}
        />
      ) : (
        <Loader />
      )}
    </Box>
  )
})
export default AdminUsers
