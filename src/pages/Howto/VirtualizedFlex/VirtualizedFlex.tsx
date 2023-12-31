import React, { useEffect, useState } from 'react'
import { Flex, Box } from 'theme-ui'
import type { ListRowProps } from 'react-virtualized'
import {
  List,
  WindowScroller,
  CellMeasurerCache,
  CellMeasurer,
} from 'react-virtualized'

interface IProps {
  data: any[]
  renderItem: (data: any) => JSX.Element
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
const breakpoints = [640, 832, 1120]
/**
 * Display a list of flex items as a virtualized list (only render what is shown),
 * automatically calculating the number of rows to be displayed via breakpoints.
 * Note, does not use react masonry/grid layouts to allow use with page scroller
 */
export const VirtualizedFlex = (props: IProps) => {
  const [state, setState] = useState<IState>({
    data: [],
    dataRows: [],
    totalColumns: -1,
  })
  const { dataRows } = state
  const { data } = props

  useEffect(() => {
    generateRowData(props)
  }, [props])

  /**
   * Split data into rows and columns depending on breakpoints
   */
  const generateRowData = (props: IProps) => {
    const oldColumns = state.totalColumns
    const oldData = state.data
    const { data } = props
    const currentWidth = window.innerWidth
    const totalColumns = _calcTotalColumns(currentWidth, breakpoints)
    // only re-render when data or columns have changed
    if (oldColumns !== totalColumns || oldData.length !== data.length) {
      const dataRows = _dataToRows(data, totalColumns)
      setState((state) => ({ ...state, totalColumns, dataRows }))
    }
  }

  /**
   * Takes an array and subdivides into row/column array
   * of arrays for a specified number of columns
   */
  const _dataToRows = (data: any[], columns: number) => {
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
  const _calcTotalColumns = (containerWidth: number, breakpoints: number[]) => {
    return Math.min(
      [0, ...breakpoints, Infinity].findIndex(
        (width) => containerWidth < width,
      ),
      breakpoints.length,
    )
  }

  /**
   * When rendering a row call the measurer to check the rendered
   * content and update the row height to ensure fit
   */
  const rowRenderer = (rowProps: ListRowProps) => {
    const { index, key, style, parent, columnIndex } = rowProps
    const { renderItem } = props
    const row = state.dataRows![index]

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

  return dataRows.length > 0 && data.length > 0 ? (
    <WindowScroller onResize={() => generateRowData(props)}>
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
          rowRenderer={(rowProps) => rowRenderer(rowProps)}
          deferredMeasurementCache={cache}
          rowHeight={cache.rowHeight}
        />
      )}
    </WindowScroller>
  ) : null
}
