import { Box, Text } from 'theme-ui'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { logger } from '../../../logger'
import Table from '../components/Table/Table'
import type {
  ITableProps,
  ICellRenderProps,
  IHeaderRenderProps,
} from '../components/Table/Table'
import HeadFilter from '../components/Table/HeadFilter'
import { observer } from 'mobx-react'
import { useCommonStores } from 'src/index'
import type { IUserBadges, IUserPPDB, UserRole } from 'src/models'
import Fuse from 'fuse.js'
import { Loader, MemberBadge } from 'oa-components'
import AdminUserSearch from '../components/adminUserSearch'
import { Link } from 'react-router-dom'
import { ProfileType } from 'src/modules/profile/types'

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

const profileTypeFilters = Object.values(ProfileType)

const userRoleFilters: UserRole[] = [
  'subscriber',
  'beta-tester',
  'admin',
  'super-admin',
]

const badgeFilters: (keyof IUserBadges)[] = ['verified', 'supporter']

const AdminUsers = observer(() => {
  const { stores } = useCommonStores()
  const [data, setData] = useState<IUserPPDB[]>([])
  const [filteredData, setFilteredData] = useState<IUserPPDB[]>([])
  const [filterValues, setFilterValues] = useState<{
    [field in keyof IUserPPDB]?: any[]
  }>({})
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

  const loadUserData = async () => {
    setLoading(true)
    try {
      // HACK - retrieve all users from the DB
      // TODO - should ideally be retrieved via aggregation to reduce DB queries
      const usersdata = await stores.userStore.db
        .collection<IUserPPDB>('users')
        .getWhere('_created', '>', '1900-01-01') // Hack - retrieve all users
      setData(usersdata)
      setFilteredData(usersdata)
      // update search data data for use in local search
      const index = Fuse.createIndex(fuseOptions.keys, usersdata)
      fuse.setCollection(usersdata, index)
    } catch (error) {
      logger.info({ error })
    }
    setLoading(false)
  }

  /** Filter data using all provided filters */
  const filterData = () => {
    const filters = Object.entries<any[]>(filterValues)
      .map(([field, values]) => ({
        field: field as keyof IUserPPDB,
        values,
      }))
      .filter(({ values }) => values.length > 0)
    const filteredData = data.filter((entry) =>
      filters.every(({ field, values }) => {
        // search badges json for truthy value (currently how aggregations handles)
        if (field === 'badges') {
          return !!values.find((v) => !!entry?.badges?.[v])
        }
        // search userRoles array for any match
        if (field === 'userRoles') {
          return !!values.find((v) => entry?.userRoles?.includes(v))
        }
        // default match single value
        return values.includes(entry[field])
      }),
    )
    setFilteredData(filteredData)
  }

  const updateFilterValues = (field: string, values: any[]) => {
    filterValues[field] = values
    setFilterValues(filterValues)
    filterData()
  }

  /** Render filter options for column type */
  const RenderFilter = ({ field, header }: IHeaderRenderProps) => {
    const filterMapping = {
      profileType: profileTypeFilters,
      userRoles: userRoleFilters,
      badges: badgeFilters,
    }
    const filterOptions = filterMapping[field]
    return filterOptions ? (
      <HeadFilter
        field={header}
        filterOptions={filterOptions}
        filterValueChanged={(values) => updateFilterValues(field, values)}
        filterValues={filterValues[field] || []}
        open={open}
        setopen={setopen}
        toOpen={toOpen}
        settoOpen={settoOpen}
      />
    ) : null
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
  const RenderContent = (props: ICellRenderProps) => {
    const { col } = props
    const { field, value, rowInfo } = col
    const userField = field as keyof IUserPPDB
    // render userName column even if no value (just show id)
    if (userField === 'userName') {
      return value ? (
        <Link to={`/u/${value}/edit`}>{value}</Link>
      ) : (
        <Box>
          <Text sx={{ display: 'block' }}>-</Text>
          <Text sx={{ fontSize: 1 }}>{rowInfo?.original['_id']}</Text>
        </Box>
      )
    }
    // render specific column values
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
    }
    // default render other columns and null values
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
          filterComponent={RenderFilter}
          rowComponent={RenderContent}
        />
      ) : (
        <Loader />
      )}
    </Box>
  )
})
export default AdminUsers
