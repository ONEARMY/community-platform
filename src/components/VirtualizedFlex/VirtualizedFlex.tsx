import * as React from 'react'
import { Flex, Box } from 'rebass'
import themes from 'src/themes/styled.theme'
import {
  List,
  WindowScroller,
  CellMeasurerCache,
  CellMeasurer,
  ListRowProps,
} from 'react-virtualized'

interface IProps {
  data: any[]
  renderItem: (data: any) => JSX.Element
  widthBreakpoints: number[]
}
interface IState {
  totalColumns?: number
  dataRows?: any[][]
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
    this.state = {}
  }
  componentDidMount() {
    this.generateRowData()
  }

  /**
   * Split data into rows and columns depending on breakpoints
   * Only re-render if the total number of columns has changed
   */
  generateRowData() {
    const previousColumns = this.state.totalColumns
    const { data, widthBreakpoints } = this.props
    const currentWidth = window.innerWidth
    const totalColumns = this._calcTotalColumns(currentWidth, widthBreakpoints)
    if (previousColumns !== totalColumns) {
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
          {row.map((rowData: any[], i: number) => (
            <Box style={{ flex: 1 }} key={key + i}>
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
    const rows: (typeof data)[] = []
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
    return dataRows ? (
      <WindowScroller onResize={() => this.generateRowData()}>
        {({ onChildScroll, isScrolling, height, width, scrollTop }) => (
          <List
            autoHeight
            height={height}
            width={width}
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
    widthBreakpoints: themes.breakpoints.map(
      // Convert theme em string to px number
      width => Number(width.replace('em', '')) * 16,
    ),
    data: [],
    renderItem: data => <div>RenderItem {data}</div>,
  }
}
