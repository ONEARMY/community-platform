import Axios from 'axios'
import { getAccessToken } from './utils'

export const getAnalyticsReport = async (viewId: string) => {
  const accessToken = await getAccessToken([
    'https://www.googleapis.com/auth/analytics',
    'https://www.googleapis.com/auth/analytics.readonly',
  ])
  console.log('access token received', accessToken)
  const result = await Axios({
    url: 'https://analyticsreporting.googleapis.com/v4/reports:batchGet',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    data: {
      reportRequests: [
        {
          viewId: viewId,
          dateRanges: [
            {
              startDate: '2019-01-01',
              endDate: 'today',
            },
          ],
          metrics: [
            {
              expression: 'ga:pageviews',
            },
          ],
          dimensions: [
            {
              name: 'ga:pagePath',
            },
          ],
          dimensionFilterClauses: [
            {
              filters: [
                {
                  dimensionName: 'ga:pagePath',
                  operator: 'BEGINS_WITH',
                  expressions: ['/discussions/post/'],
                },
              ],
            },
          ],
        },
      ],
    },
  })
  console.log('result received', result)
  return result.data.reports[0].data.rows
}
