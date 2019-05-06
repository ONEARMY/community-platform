/************ Cloud Firestore Triggers ******************************************************
 Functions called in response to changes in Cloud Firestore database
 ************************************************************************************/
// exports.syncCommentsCount = functions.firestore
//   .document('discussions/{discussionId}/comments/{commentId}')
//   .onWrite(async (change, context) => {
//     await syncCommentsCount(context)
//   })

/************ Storage Triggers ******************************************************
Functions called in response to changes to firebase storage objects
************************************************************************************/

// exports.imageResize = functions.storage.object().onFinalize(async object => {
// if (object.metadata && (object.metadata.resized || object.metadata.original))
//   return Promise.resolve()
// return ImageConverter.resizeStorageImage(object)
// })

/************ Callable *************************************************************
These can be called from directly within the app (passing additional auth info)
https://firebase.google.com/docs/functions/callable
Any functions added here should have a custom url rewrite specified in root firebase.json
to handle CORS preflight requests correctly
************************************************************************************/

// use service agent to gain access credentials for gcp with  given access scopes
// exports.getAccessToken = functions.https.onCall(
//   async (data: getAccessTokenData) => {
//     const token = await UtilsFunctions.getAccessToken(data.accessScopes)
//     return token
//   },
// )
// interface getAccessTokenData {
//   accessScopes: string[]
// }

// exports.getAnalytics = functions.https.onCall(
//   async (data: getAnalyticsData) => {
//     console.log('get analytics request received', data)
//     await AnalyticsFunctions.getAnalyticsReport(data.viewId, data.token)
//   },
// )
// interface getAnalyticsData {
//   viewId: string
//   token: string
// }
// exports.syncCommentsCount = functions.https.onCall(async () => {
//   console.log('sync comments count called')
// })
