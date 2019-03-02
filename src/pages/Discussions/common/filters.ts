export interface IFilter {
  op: string
  value: any
  type?: string
  next?: IFilter[]
  visible: boolean
}
export interface IPropertyFilter {
  prop: string
  filter: IFilter
}

export const keyOf = (object, value) =>
  Object.keys(object).find(key => object[key] === value)

export let FilterTypeMap = {
  title: 'string',
  tags: 'array',
  users: 'number',
  date: 'time',
}

const flatten = (inFilters: IPropertyFilter[]): IPropertyFilter[] => {
  let filters: any[] = []
  inFilters.forEach(f => {
    filters.push(f)
    if (f.filter.next) {
      filters = filters.concat(
        f.filter.next.map(n => {
          return {
            prop: f.prop,
            filter: n,
          }
        }),
      )
    }
  })
  return filters
}

export const toFilterExpression = (filters: IPropertyFilter[]) => {
  const all = flatten(filters)
  const ors = all.filter(f => {
    return f.filter.type === 'or'
  })
  const heads = filters.map(
    (f: IPropertyFilter): IPropertyFilter => {
      return {
        filter: {
          op: f.filter.op,
          value: f.filter.value,
        } as any,
        prop: f.prop,
      }
    },
  )

  const ands1 = all.filter(f => {
    return f.filter.type === 'and'
  })

  const ands = [...heads, ...ands1]

  const ret = {
    operator: 'or',
    filters: [
      {
        operator: 'or',
        filters: ors.map(f => {
          return {
            columnName: f.prop,
            value:
              FilterTypeMap[f.prop] === 'number'
                ? parseInt(f.filter.value, 10)
                : f.filter.value,
            op: f.filter.op,
          }
        }),
      },
      {
        operator: 'and',
        filters: ands.map(f => {
          return {
            columnName: f.prop,
            value:
              FilterTypeMap[f.prop] === 'number'
                ? parseInt(f.filter.value, 10)
                : f.filter.value,
            op: f.filter.op,
          }
        }),
      },
    ],
  }
  return ret
}
// ui
export const defaultMessages = {
  filterPlaceholder: 'Filter...',
  contains: 'Contains',
  notContains: 'Does not contain',
  startsWith: 'Starts with',
  endsWith: 'Ends with',
  equal: 'Equals',
  notEqual: 'Does not equal',
  greaterThan: 'Greater than',
  greaterThanOrEqual: 'Greater than or equal to',
  lessThan: 'Less than',
  before: 'Is before',
  after: 'Is after',
  lessThanOrEqual: 'Less than or equal to',
  has: 'Has',
  hasNot: 'Has not',
  atLeast: 'At least',
  atMost: 'At most',
}

export const defaultOperands = {
  number: keyOf(defaultMessages, defaultMessages.greaterThanOrEqual),
  string: keyOf(defaultMessages, defaultMessages.contains),
  array: keyOf(defaultMessages, defaultMessages.has),
  time: keyOf(defaultMessages, defaultMessages.atLeast),
  date: keyOf(defaultMessages, defaultMessages.after),
}

const operators = {
  or: predicates => row =>
    predicates.reduce((acc, predicate) => acc || predicate(row), false),
  and: predicates => row =>
    predicates.reduce((acc, predicate) => acc && predicate(row), true),
}

const toLowerCase = value => String(value).toLowerCase()

export const operationPredicates = {
  contains: (value, filter) =>
    toLowerCase(value).indexOf(toLowerCase(filter.value)) > -1,
  notContains: (value, filter) =>
    toLowerCase(value).indexOf(toLowerCase(filter.value)) === -1,
  startsWith: (value, filter) =>
    toLowerCase(value).startsWith(toLowerCase(filter.value)),
  endsWith: (value, filter) =>
    toLowerCase(value).endsWith(toLowerCase(filter.value)),
  equal: (value, filter) => value === filter.value,
  notEqual: (value, filter) => value !== filter.value,
  greaterThan: (value, filter) => value > filter.value,
  greaterThanOrEqual: (value, filter) => value >= filter.value,
  lessThan: (value, filter) => value < filter.value,
  lessThanOrEqual: (value, filter) => value <= filter.value,
  after: (value, filter) => value > filter.value,
  before: (value, filter) => value < filter.value,
  atLeast: (value, filter) => {
    /*
    const d = new Date()
    d.setSeconds(value)
    const eD: Date = filter.value
    const e = new Date()
    e.setSeconds(eD.getSeconds())
    e.setMinutes(eD.getMinutes())
    const duration = moment.duration(moment(d).diff(moment(e)))
    return duration.asSeconds() > 0*/
  },
  atMost: (value, filter) => {
    /*
    const d = new Date()
    d.setSeconds(value)
    const eD: Date = filter.value
    const e = new Date()
    e.setSeconds(eD.getSeconds())
    e.setMinutes(eD.getMinutes())
    const duration = moment.duration(moment(d).diff(moment(e)))
    return duration.asSeconds() < 0
    */
  },
  has: (value, filter) => {
    return value.find(v => v.indexOf(filter.value) !== -1) != null
  },
  hasNot: (value, filter) => value.indexOf(filter.value) === -1,
}

export const defaultFilterPredicate = (value, filter) => {
  const operation = filter.operation || 'greaterThanOrEqual'
  return operationPredicates[operation](value, filter)
}

const buildPredicate = (
  initialFilterExpression,
  getCellValue,
  getColumnPredicate,
) => {
  const getSimplePredicate = filterExpression => {
    const { columnName } = filterExpression
    const customPredicate = getColumnPredicate && getColumnPredicate(columnName)
    const predicate = customPredicate || defaultFilterPredicate
    return row =>
      predicate(getCellValue(row, columnName), filterExpression, row)
  }

  const getOperatorPredicate = filterExpression => {
    const build = operators[toLowerCase(filterExpression.operator)]
    // eslint-disable-next-line no-use-before-define
    return build && build(filterExpression.filters.map(getPredicate))
  }

  const getPredicate = filterExpression =>
    getOperatorPredicate(filterExpression) ||
    getSimplePredicate(filterExpression)

  return getPredicate(initialFilterExpression)
}

export const filteredRows = (
  rows,
  filterExpression,
  getCellValue,
  getColumnPredicate?,
) => {
  if (
    !(filterExpression && Object.keys(filterExpression).length && rows.length)
  ) {
    return { rows }
  }

  const predicate = buildPredicate(
    filterExpression,
    getCellValue,
    getColumnPredicate,
  )

  return { rows: rows.filter(predicate) }
}

export const filteredCollapsedRowsGetter = ({ collapsedRowsMeta }) => row =>
  collapsedRowsMeta && collapsedRowsMeta.get(row)

export const unwrappedFilteredRows = ({ rows }) => rows

export const tagFilter = (tags, time) => [
  {
    prop: 'tags',
    filter: {
      op: 'contains',
      value: tags,
    },
  },
  {
    prop: 'date',
    filter: {
      op: 'after',
      value: time,
    },
  },
]
