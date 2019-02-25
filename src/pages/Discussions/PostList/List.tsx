import {
  Sorting,
  SortingState,
  FilteringState,
  SearchState,
  IntegratedSorting,
  PagingState,
  IntegratedPaging,
} from '@devexpress/dx-react-grid'
import {
  Grid,
  Table,
  TableHeaderRow,
  PagingPanel,
} from '@devexpress/dx-react-grid-material-ui'
import Paper from '@material-ui/core/Paper'
import * as React from 'react'
import { columns, columnSizes, compareDate } from '../common'
import { render } from './fields'

const PAGE_SIZE = 8

const cell = props => {
  const { name } = props.column
  return (
    <Table.Cell {...props as Table.DataCellProps} value={''}>
      {render(name, props)}
    </Table.Cell>
  )
}

const TableRow = ({ row, ...restProps }) => {
  return <Table.Row {...restProps as Table.DataRowProps} />
}

export class PostList2 extends React.Component<any, any> {
  hiddenColumnNamesChange: (hiddenColumnNames: any) => void
  changeSearchValue: (value: any) => void
  constructor(props) {
    super(props)
    this.state = {
      columns: columns(),
      sorting: [{ columnName: '_created', direction: 'asc' } as Sorting],
      defaultHiddenColumnNames: ['type'],
      tableColumnExtensions: columnSizes(),
      integratedSortingColumnExtensions: [
        { columnName: '_created', compare: compareDate },
      ],
    }
    this.hiddenColumnNamesChange = hiddenColumnNames => {
      this.setState({ hiddenColumnNames })
    }

    this.changeSearchValue = value =>
      this.setState({
        searchValue: value,
      })
  }
  container: any

  changeSorting = sorting => {
    this.setState({ sorting })
  }

  render() {
    const { tableColumnExtensions, sorting, searchValue } = this.state

    // @TODO, fix me I had no better idea about dealing with mobx
    let { posts } = this.props
    if (!posts || !posts[0] || !posts[0]._id || !posts.length) {
      return null
    }
    posts = posts.filter(p => p._id)

    return (
      <Paper>
        <Grid rows={posts} columns={columns()}>
          <SearchState
            value={searchValue}
            onValueChange={this.changeSearchValue}
          />
          <FilteringState columnFilteringEnabled={false} defaultFilters={[]} />

          <SortingState
            defaultSorting={sorting}
            onSortingChange={this.changeSorting}
          />
          <IntegratedSorting
            columnExtensions={this.state.integratedSortingColumnExtensions}
          />

          <PagingState defaultCurrentPage={0} pageSize={PAGE_SIZE} />
          <IntegratedPaging />

          <Table
            cellComponent={cell}
            rowComponent={TableRow}
            columnExtensions={tableColumnExtensions}
          />

          {posts.length > PAGE_SIZE && <PagingPanel />}

          <TableHeaderRow showSortingControls />
        </Grid>
      </Paper>
    )
  }
}
