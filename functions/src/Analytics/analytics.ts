import Axios from 'axios'

export const getAnalyticsReport = async (
  viewId: string,
  accessToken: string,
) => {
  console.log('getting analytics report', viewId, accessToken)
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
