import { onCustomEventPublished } from 'firebase-functions/v2/eventarc'
import { getFirestore } from 'firebase-admin/firestore'

export const userPhotoResizeSuccess = onCustomEventPublished(
  {
    eventType: 'firebase.extensions.storage-resize-images.v1.complete',
  },
  (event) => {
    const userId = event.subject.split('users/')[1].split('/')[0]

    return getFirestore()
      .collection('users')
      .doc(userId)
      .update({ coverImages: [event.data.outputs[0].outputFilePath] })
  },
)
