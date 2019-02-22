import ReactGA from 'react-ga'
import { GOOGLE_ANALYTICS_CONFIG } from 'src/config/config'

export class AnalyticsStore {
  constructor() {
    ReactGA.initialize(GOOGLE_ANALYTICS_CONFIG.trackingCode, { debug: true })
  }
  public postViewReactGA(postId: string) {
    ReactGA.ga('send', 'pageview', '/discussions/post/' + postId)
  }

  // function to pull data from google analytics
  // *** NOTE - currently broken (CORs) and requires move to server functions (see issue #320)
  public async getAnalytics() {
    // const credsRequest = await functions.httpsCallable('getAccessToken')({
    //   accessScopes: [
    //     'https://www.googleapis.com/auth/analytics',
    //     'https://www.googleapis.com/auth/analytics.readonly',
    //   ],
    // })
    // console.log('creds request', credsRequest)
    // const analyticsReportRequest = functions.httpsCallable('getAnalyticsReport')
    // console.log('getting analytics')
    // const analyticsReportRows = (await analyticsReportRequest({
    //   viewId: GOOGLE_ANALYTICS_CONFIG.viewId,
    //   credentials: credsRequest.data.token,
    // })) as any
    // console.log('report rows', analyticsReportRows)
    // const updatedPosts = this.state.posts
    // if (analyticsReportRows) {
    //   for (const post of updatedPosts) {
    //     const postAnalytic = analyticsReportRows.find(
    //       row => row.dimensions[0] === `/discussions/post/${post._id}`,
    //     )
    //     if (postAnalytic) {
    //       post.viewCount = Number(postAnalytic.metrics[0].values[0])
    //     } else {
    //       post.viewCount = 0
    //     }
    //   }
    // }
  }
}
