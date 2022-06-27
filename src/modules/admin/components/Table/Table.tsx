import React from 'react'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import '../../pages/admin-users.css'
import { Box, Text } from 'theme-ui'
import TableHead from './TableHead'
import type { IUserPP } from 'src/models'

type TableProps = {
  columns: {
    Header: string
    accessor: string
    minWidth: number
  }[]
  data: IUserPP[]
  filters?: React.FC | any
  TData?: React.FC | any
}

function Table(props: TableProps) {
  return (
    <ReactTable
      style={{
        border: 'none',
        maxHeight: '40rem',
      }}
      ThComponent={(row) => {
        return (
          <TableHead row={row}>
            <Text
              onClick={(e) => row.toggleSort(e)}
              sx={{
                backgroundColor: '#E2EDF7',
                padding: '10px',
                borderRadius: '4px',
              }}
              className={row.className}
            >
              {row.children[0].props.children}
            </Text>
            <props.filters val={row.children[0].props.children} />
          </TableHead>
        )
      }}
      TdComponent={(col) => {
        if (!col.rowData) {
          return <></>
        }
        return props.TData ? (
          <Box
            sx={{
              flex: '100 0 auto',
              width: '50px',
              color: col.id == 'Username' ? '#0898CB' : 'black',
              textDecoration: col.id == 'Username' ? 'underline' : 'none',
              cursor: col.id == 'Username' ? 'pointer' : 'default',
            }}
          >
            <props.TData col={col} />
          </Box>
        ) : (
          <Box
            sx={{
              flex: '120 0 auto',
              width: '120px',
              color: col.id == 'Username' ? '#0898CB' : 'black',
            }}
          >
            {col?.children?.toString() ? col?.children?.toString() : '-'}
          </Box>
        )
      }}
      getTdProps={(state, rowInfo, column) => {
        return {
          id: column.Header,
          rowData: rowInfo,
        }
      }}
      getTrProps={() => {
        return {
          style: {
            marginTop: '10px',
            marginBottom: '10px',
            border: '1px solid',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            padding: '10px',
            height: '4rem',
            backgroundColor: 'white',
          },
        }
      }}
      getPaginationProps={() => {
        return {
          style: {
            marginTop: '10px',
          },
        }
      }}
      showPagination={true}
      data={props.data}
      columns={props.columns}
      defaultPageSize={10}
      minRows={props.data.length ? 3 : 1}
      showPageSizeOptions={true}
      sortable
    />
  )
}

export default Table
