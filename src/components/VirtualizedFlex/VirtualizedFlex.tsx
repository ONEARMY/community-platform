import * as React from 'react'
import { Flex, Box } from 'theme-ui'
import themes from 'src/themes/styled.theme'
import {
  List,
  WindowScroller,
  CellMeasurerCache,
  CellMeasurer,
  ListRowProps,
} from 'react-virtualized'
import { emStringToPx } from 'src/utils/helpers'

interface IProps {
  data: any[]
  renderItem: (data: any) => JSX.Element
  widthBreakpoints: number[]
}
interface IState {
  totalColumns: number
  data: any[]
  dataRows: any[][]
}

// User a measurement cache to dynamically calculate dynamic row heights based on content
const cache = new CellMeasurerCache({
  fixedWidth: true,
  //  only use a single key for all rows (assumes all rows the same height)
  keyMapper: () => 0,
})
/**
 * Display a list of flex items as a virtualized list (only render what is shown),
 * automatically calculating the number of rows to be displayed via breakpoints.
 * Note, does not use react masonry/grid layouts to allow use with page scroller
 */
export class VirtualizedFlex extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = { data: [], dataRows: [], totalColumns: -1 }
  }

  /* eslint-disable @typescript-eslint/naming-convention*/
  UNSAFE_componentWillReceiveProps(props: IProps) {
    this.generateRowData(props)
  }

  /**
   * Split data into rows and columns depending on breakpoints
   */
  generateRowData(props: IProps) {
    const oldColumns = this.state.totalColumns
    const oldData = this.state.data
    const { widthBreakpoints, data } = props
    const currentWidth = window.innerWidth
    const totalColumns = this._calcTotalColumns(currentWidth, widthBreakpoints)
    // only re-render when data or columns have changed
    if (oldColumns !== totalColumns || oldData.length !== data.length) {
      const dataRows = this._dataToRows(data, totalColumns)
      this.setState({ totalColumns, dataRows })
    }
  }

  /**
   * When rendering a row call the measurer to check the rendered
   * content and update the row height to ensure fit
   */
  rowRenderer(rowProps: ListRowProps) {
    const { index, key, style, parent } = rowProps
    const { renderItem } = this.props
    const row = this.state.dataRows![index]
    return (
      <CellMeasurer
        cache={cache}
        key={key}
        parent={parent}
        // simply measure first cell as all will be the same
        columnIndex={0}
        rowIndex={0}
      >
        <Flex key={key} style={style}>
          {row.map((rowData: any, i: number) => (
            <Box
              key={key + i}
              sx={{ width: ['100%', `${100 * 0.5}%`, `${100 / 3}%`] }}
            >
              {renderItem(rowData)}
            </Box>
          ))}
        </Flex>
      </CellMeasurer>
    )
  }
  /**
   * Takes an array and subdivides into row/column array
   * of arrays for a specified number of columns
   */
  private _dataToRows(data: any[], columns: number) {
    const totalRows = Math.ceil(data.length / columns)
    const rows: typeof data[] = []
    for (let i = 0; i < totalRows; i++) {
      rows.push(data.slice(columns * i, columns * (i + 1)))
    }
    return rows
  }
  /**
   * Use theme breakpoints to decide how many columns
   */
  private _calcTotalColumns(containerWidth: number, breakpoints: number[]) {
    return Math.min(
      [0, ...breakpoints, Infinity].findIndex(width => containerWidth < width),
      breakpoints.length,
    )
  }

  render() {
    const { dataRows } = this.state
    return dataRows.length > 0 ? (
      <WindowScroller onResize={() => this.generateRowData(this.props)}>
        {({ onChildScroll, isScrolling, height, width, scrollTop }) => (
          <List
            autoHeight
            width={width}
            height={height}
            isScrolling={isScrolling}
            onScroll={onChildScroll}
            scrollTop={scrollTop}
            rowCount={dataRows.length}
            overscanRowCount={2}
            rowRenderer={rowProps => this.rowRenderer(rowProps)}
            deferredMeasurementCache={cache}
            rowHeight={cache.rowHeight}
          />
        )}
      </WindowScroller>
    ) : null
  }

  static defaultProps: IProps = {
    widthBreakpoints: themes.breakpoints.map(emStringToPx),
    data: [],
    renderItem: data => <div>RenderItem {data}</div>,
  }
}
