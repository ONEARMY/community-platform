import * as React from 'react'
import { Flex, Box } from 'theme-ui'
// TODO: Remove direct usage of Theme
import { preciousPlasticTheme } from 'oa-themes'
const themes = preciousPlasticTheme.styles
import type { ListRowProps } from 'react-virtualized'
import {
  List,
  WindowScroller,
  CellMeasurerCache,
  CellMeasurer,
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

// Use a measurement cache to dynamically calculate dynamic row heights based on content
const cache = new CellMeasurerCache({
  fixedWidth: true,
})

/**
 * Display a list of flex items as a virtualized list (only render what is shown),
 * automatically calculating the number of rows to be displayed via breakpoints.
 * Note, does not use react masonry/grid layouts to allow use with page scroller
 */
export class VirtualizedFlex extends React.Component<IProps, IState> {
  static defaultProps: IProps = {
    widthBreakpoints: themes.breakpoints.map(emStringToPx),
    data: [],
    renderItem: (data) => <div>RenderItem {data}</div>,
  }
  constructor(props: IProps) {
    super(props)
    this.state = { data: [], dataRows: [], totalColumns: -1 }
  }
  componentDidMount() {
    this.generateRowData(this.props)
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
    const { index, key, style, parent, columnIndex } = rowProps
    const { renderItem } = this.props
    const row = this.state.dataRows![index]
    return (
      <CellMeasurer
        cache={cache}
        key={key}
        parent={parent}
        // simply measure first cell as all will be the same
        columnIndex={columnIndex}
        rowIndex={index}
      >
        <Flex key={key} style={style}>
          {row.map((rowData: any, i: number) => (
            <Box
              py={4}
              px={4}
              key={key + i}
              sx={{
                width: ['100%', `${100 * 0.5}%`, `${100 / 3}%`],
                height: '100%',
              }}
            >
              {renderItem(rowData)}
            </Box>
          ))}
        </Flex>
      </CellMeasurer>
    )
  }
  render() {
    const { dataRows } = this.state
    const { data } = this.props
    return dataRows.length > 0 && data.length > 0 ? (
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
            rowRenderer={(rowProps) => this.rowRenderer(rowProps)}
            deferredMeasurementCache={cache}
            rowHeight={cache.rowHeight}
          />
        )}
      </WindowScroller>
    ) : null
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
      [0, ...breakpoints, Infinity].findIndex(
        (width) => containerWidth < width,
      ),
      breakpoints.length,
    )
  }
}
