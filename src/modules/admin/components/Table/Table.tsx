import React from 'react'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import { Box, Text } from 'theme-ui'
import type { IUserPP } from 'src/models'
import TableHead from './TableHead'
import { css, Global } from '@emotion/react'

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
    <>
      <Global
        styles={css`
          .ReactTable .rt-thead.-header {
            box-shadow: none !important;
          }
        `}
      />
      <ReactTable
        data-cy="reactTable"
        style={{
          border: 'none',
        }}
        ThComponent={(row) => {
          const isSortAsc = row.className.includes('-sort-asc')
          const isSortDesc = row.className.includes('-sort-desc')
          return (
            <TableHead row={row}>
              <Text
                onClick={(e) => row.toggleSort(e)}
                p={2}
                sx={{
                  backgroundColor: '#E2EDF7',
                  borderRadius: '4px',
                }}
                className={row.className}
              >
                {row.children[0].props.children}
              </Text>
              {isSortAsc && <Text>⬆️</Text>}
              {isSortDesc && <Text>⬇️</Text>}
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
    </>
  )
}

export default Table
