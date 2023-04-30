import React from 'react'
import type { MouseEvent } from 'react'
import ReactTable from 'react-table'
import type {
  Column,
  ComponentPropsGetterRC,
  RowInfo,
  ComponentPropsGetterC,
} from 'react-table'
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
export interface IHeaderRenderProps {
  field: string
  header: string
  className: string
  toggleSort?: (e: MouseEvent) => void
}

export interface ITableProps<T = any> {
  columns: Column[]
  data: T[]
  filterComponent?: (props: IHeaderRenderProps) => React.ReactNode
  rowComponent: React.ComponentType<ICellRenderProps>
}
const getTdProps: ComponentPropsGetterRC = (
  finalState,
  rowInfo?,
  column?,
): ICellRenderProps['col'] => {
  const field = column?.id || ''
  return {
    field,
    value: rowInfo?.original[field],
    rowInfo,
  }
}
const getTHeadThProps: ComponentPropsGetterC = (
  finalState,
  rowInfo,
  column,
): IHeaderRenderProps => {
  const field = column?.id || ''
  return {
    field,
    header: column?.Header as string,
    className: column?.className as string,
  }
}

const Table = (props: ITableProps) => {
  const { filterComponent } = props
  return (
    <>
      {/* Override styles applied in global css */}
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
          height: 'calc(100vh - 410px)',
          minHeight: '500px',
        }}
        ThComponent={(row: IHeaderRenderProps) => {
          const isSortAsc = row.className?.includes('-sort-asc')
          const isSortDesc = row.className?.includes('-sort-desc')
          const { header, className, toggleSort } = row
          return (
            <TableHead row={row}>
              <Text
                onClick={(e) => toggleSort?.(e)}
                p={2}
                sx={{
                  backgroundColor: '#E2EDF7',
                  borderRadius: '4px',
                }}
                className={className}
              >
                {header}
              </Text>
              {isSortAsc && <Text>⬆️</Text>}
              {isSortDesc && <Text>⬇️</Text>}
              {filterComponent &&
                filterComponent({ ...row } as IHeaderRenderProps)}
            </TableHead>
          )
        }}
        TdComponent={(col) => (
          <Box
            sx={{
              flex: '100 0 auto',
              width: '50px',
              a: {
                color: '#67bfdf',
                textDecoration: 'underline',
              },
              'a:hover': {
                textDecoration: 'none',
              },
            }}
          >
            <props.rowComponent col={col} />
          </Box>
        )}
        getTdProps={getTdProps}
        getTheadThProps={getTHeadThProps}
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
