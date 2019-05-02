import { observable, action } from 'mobx'
import { afs } from '../../utils/firebase'
import { IHowto, IHowtoFormInput, IHowtoStep } from 'src/models/howto.models'
import { Database } from 'src/stores/database'
import { stripSpecialCharacters } from 'src/utils/helpers'
import { IConvertedFileMeta } from 'src/components/ImageInput/ImageInput'
import { Storage } from '../storage'
import { FieldState } from 'final-form'

export class HowtoStore {
  // we have two property relating to docs that can be observed
  @observable
  public activeHowto: IHowto | undefined
  @observable
  public allHowtos: IHowto[] = []
  @observable
  public uploadStatus: IHowToUploadStatus = getInitialUploadStatus()
  // *** TODO - migrate these to standard database/common module.store methods (not call afs directly)
  // call getDocList to query 'Howtos' from db and map response to docs observable
  @action
  public async getDocList() {
    const ref = await afs
      .collection('howtos')
      .orderBy('_created', 'desc')
      .get()

    this.allHowtos = ref.docs.map(doc => doc.data() as IHowto)
  }
  @action
  public async getDocBySlug(slug: string) {
    const ref = afs
      .collection('howtos')
      .where('slug', '==', slug)
      .limit(1)
    const collection = await ref.get()
    const activeHowto =
      collection.docs.length > 0
        ? (collection.docs[0].data() as IHowto)
        : undefined
    this.activeHowto = activeHowto
    return activeHowto
  }
  @action
  public updateUploadStatus(update: keyof IHowToUploadStatus) {
    this.uploadStatus[update] = true
  }

  public isSlugUnique = async (slug: string) => {
    try {
      await Database.checkSlugUnique('howtos', slug)
    } catch (e) {
      return 'How-to titles must be unique, please try being more specific'
    }
  }

  public validateTitle = async (value: any, meta?: FieldState) => {
    if (meta && (!meta.dirty && meta.valid)) {
      return undefined
    }
    if (value) {
      const error = this.isSlugUnique(stripSpecialCharacters(value))
      return error
    } else if ((meta && (meta.touched || meta.visited)) || value === '') {
      return 'A title for your how-to is required'
    }
    return undefined
  }

  public generateID = () => {
    return Database.generateDocId('howtos')
  }

  public async uploadHowTo(values: IHowtoFormInput, id: string) {
    const slug = stripSpecialCharacters(values.tutorial_title)
    // present uploading modal

    try {
      // upload images
      console.log('uploading cover images', values.cover_image)
      values.cover_image = await this.uploadCoverImg(values.cover_image[0], id)
      this.updateUploadStatus('Cover')
      console.log('cover image uploaded')
      values.steps = await this.uploadStepImgs(values.steps, id)
      this.updateUploadStatus('Step Images')
      console.log('step images uploaded')
      // upload files

      this.updateUploadStatus('Files')
      // populate DB
      this.updateDatabase(values, id)
      this.updateUploadStatus('Database')
      // complete
      this.updateUploadStatus('Complete')
      console.log('post added')
    } catch (error) {
      console.log('error', error)
      return error
    }
  }

  private uploadCoverImg(file: IConvertedFileMeta, id: string) {
    return Storage.uploadFile(`uploads/howTos/${id}`, file.name, file.photoData)
  }

  private async uploadStepImgs(steps: IHowtoStep[], id: string) {
    // NOTE - outer loop could be a map and done in parallel but for loop easier to manage
    console.log('uploading steps', steps)
    const stepsWithImgMeta: IHowtoStep[] = []
    for (const step of steps) {
      console.log('uploading step', step)
      const stepImages = step.images as IConvertedFileMeta[]
      const promises = stepImages.map(async img => {
        const meta = await Storage.uploadFile(
          `uploads/howTos/${id}`,
          img.name,
          img.photoData,
        )
        return meta
      })
      const imgMeta = await Promise.all(promises)
      step.images = imgMeta
      stepsWithImgMeta.push(step)
    }
    console.log('steps', steps)
    return stepsWithImgMeta
  }

  // TODO - tighten typings (will require additional types for pre/post image compression data)
  private updateDatabase(values, id: string) {
    const meta = Database.generateDocMeta('howtos', id)
    const howTo: IHowto = { ...values, ...meta }
    return Database.setDoc(`howtos/${values._id}`, howTo)
  }
}

//

// convert data to correct types and populate metadata
// const values: IHowto = {
//   ...formValues,
//   slug,
//   cover_image: formValues.cover_image as IFirebaseUploadInfo,
// }
// try {
//   await afs
//     .collection('documentation')
//     .doc(formValues.id)
//     .set(values)
//   this.setState({ formSaved: true })
//   this.props.history.push('/how-to/' + slug)
// } catch (error) {
//   console.log('error while saving the tutorial')
// }

interface IHowToUploadStatus {
  Cover: boolean
  Files: boolean
  'Step Images': boolean
  Database: boolean
  Complete: boolean
}

function getInitialUploadStatus() {
  const status: IHowToUploadStatus = {
    Cover: false,
    Files: false,
    'Step Images': false,
    Database: false,
    Complete: false,
  }
  return status
}
