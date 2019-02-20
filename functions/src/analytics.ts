import Axios from 'axios'
import { Credentials } from 'google-auth-library'
import { resolve } from 'url'

export const getAnalyticsReport = async (
  viewId: string,
  accessToken: Credentials,
) => {
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
  }).catch(err => {
    console.log('analytics error', err)
    return err
  })
  console.log('result received', result)
  return result.data.reports[0].data.rows
}
