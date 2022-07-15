import React from 'react'
import ReactTable from 'react-table'
import type { Column, ComponentPropsGetterRC, RowInfo } from 'react-table'
import 'react-table/react-table.css'
import { Box, Text } from 'theme-ui'
import TableHead from './TableHead'
import { css, Global } from '@emotion/react'

/** Props rendered for each row cell */
export interface ICellRenderProps {
  col: {
    field?: string
    value?: any
    rowInfo?: RowInfo
  }
}

export interface ITableProps<T = any> {
  columns: Column[]
  data: T[]
  filters?: React.FC | any
  rowComponent: React.FC<ICellRenderProps>
}
const getTdProps: ComponentPropsGetterRC = (finalState, rowInfo?, column?) => {
  const field = column?.id || ''
  const tdProps: ICellRenderProps['col'] = {
    field,
    value: rowInfo?.original[field],
    rowInfo,
  }
  return tdProps
}

function Table(props: ITableProps) {
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
        TdComponent={(col) => (
          <Box
            sx={{
              flex: '100 0 auto',
              width: '50px',
              color: col.id == 'Username' ? '#0898CB' : 'black',
              textDecoration: col.id == 'Username' ? 'underline' : 'none',
              cursor: col.id == 'Username' ? 'pointer' : 'default',
            }}
          >
            <props.rowComponent col={col} />
          </Box>
        )}
        getTdProps={getTdProps}
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
