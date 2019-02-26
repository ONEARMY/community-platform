import { Column } from '@devexpress/dx-react-grid'

export const columnSizes = () => [
  { columnName: 'avatar', width: 100 },
  { columnName: '_commentCount', width: 100 },
  { columnName: 'title', width: 310 },
  { columnName: 'type', width: 120 },
  { columnName: '_usefullCount', width: 80 },
  { columnName: '_viewCount', width: 80 },
  { columnName: '_created', width: 120 },
]

export const columns = (): Column[] => {
  return [
    { name: 'avatar', title: 'User' /*, getCellValue: val => 'some user' */ },
    { name: 'title', title: 'Title' },
    { name: '_commentCount', title: 'Replies' },
    { name: '_usefullCount', title: 'Useful' },
    { name: '_viewCount', title: 'Views' },
    {
      name: '_created',
      title: 'Freshness',
    },
    { name: 'icon', title: ' ' },
  ]
}
