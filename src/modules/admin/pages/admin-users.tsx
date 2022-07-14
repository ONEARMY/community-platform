import { Box } from 'theme-ui'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import Table from '../components/Table/Table'
import Header from '../components/Header'
import HeadFilter from '../components/Table/HeadFilter'
import { observer } from 'mobx-react'
import { useCommonStores } from 'src/index'
import workspace from '../../../assets/images/badges/pt-workspace.jpg'
import machineBuilder from '../../../assets/images/badges/pt-machine-shop.jpg'
import communitybuilder from '../../../assets/images/badges/pt_community_point.png'
import member from '../../../assets/images/badges/pt-member.jpg'
import collectionPoint from '../../../assets/images/badges/pt-collection-point.jpg'
import type { IUserPP } from 'src/models'
import Fuse from 'fuse.js'
import { Loader } from 'oa-components'

const TAG_TABLE_COLUMNS: any[] = [
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
    Header: 'Status',
    accessor: 'verified',
    minWidth: 140,
  },
]

interface Props {
  val: string
}

interface DataProps {
  col: {
    id: string
    children: any
    rowData: any
  }
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
  const [data, setData] = useState<IUserPP[]>([])
  const [filteredData, setFilteredData] = useState<IUserPP[]>([])
  const [filterBy, setFilterBy] = useState<string[]>([])
  const [open, setopen] = useState<boolean>(false)
  const [toOpen, settoOpen] = useState('')

  const [loading, setLoading] = useState(false)
  useEffect(() => {
    getUsers()
  }, [])

  useEffect(() => {
    if (filterBy.length > 0) filterByType()
    else setFilteredData(data)
  }, [filterBy])

  const getUsers = async () => {
    setLoading(true)
    try {
      const usersdata = await stores.userStore.getAllUser()
      setData(usersdata)
      setFilteredData(usersdata)
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
    const filteredTypes: IUserPP[] = []
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

  const getTypeImage = (type: string) => {
    let img = ''
    switch (type) {
      case 'workspace':
        img = workspace
        break
      case 'community-builder':
        img = communitybuilder
        break
      case 'member':
        img = member
        break
      case 'machine-builder':
        img = machineBuilder
        break
      case 'collection-point':
        img = collectionPoint
        break

      default:
        break
    }
    if (img) {
      return (
        <img
          src={img}
          style={{
            width: '3rem',
            height: '3rem',
            display: 'flex',
            alignContent: 'center',
          }}
        />
      )
    }
    return type
  }

  const renderText = ({ col }: DataProps) => {
    if (col.id == 'Username' && col?.rowData?.original?._id) {
      return (
        <Link to={'/admin_v2/users/' + col?.rowData?.original?._id}>
          {col.children}
        </Link>
      )
    }
    return col?.children?.toString()
  }

  const RenderContent: React.FC<DataProps> = (props: DataProps) => {
    const { col } = props
    if (col?.children || col?.children?.toString()) {
      if (col.id === 'Type') {
        return getTypeImage(col?.children?.toString())
      }
      if (col.id === 'Signup Date') {
        return format(new Date(col?.children?.toString()), 'DD-MM-YYYY')
      }
      return renderText({ col })
    } else {
      return '-'
    }
  }

  const searchData = (val) => {
    const options = {
      keys: ['userName'],
    }
    // Change the pattern
    if (!val) {
      setFilteredData(data)
      return
    }
    const index = Fuse.createIndex(options.keys, data)
    const fuse = new Fuse(data, options, index)
    const tempData = fuse.search(val).map((it) => it.item)
    setFilteredData(tempData)
  }

  return (
    <Box sx={{ width: '100%', mt: 5 }}>
      <Header total={filteredData.length} onChange={searchData} />
      {!loading ? (
        <Table
          data={filteredData}
          columns={TAG_TABLE_COLUMNS}
          filters={RenderFilter}
          TData={RenderContent}
        />
      ) : (
        <Loader />
      )}
    </Box>
  )
})
export default AdminUsers
