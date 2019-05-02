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

    // upload images

    try {
      values.cover_image = await this.uploadCoverImg(values.cover_image[0], id)
      console.log('cover image uploaded')
      values.steps = await this.uploadStepImgs(values.steps, id)
      console.log('step images uploaded')
    } catch (error) {
      console.log('error', error)
    }
  }

  private uploadCoverImg(file: IConvertedFileMeta, id: string) {
    return Storage.uploadFile(`uploads/howTos/${id}`, file.name, file.photoData)
  }

  private async uploadStepImgs(steps: IHowtoStep[], id: string) {
    const firstStep = steps[0]
    const stepImages = firstStep.images as IConvertedFileMeta[]
    // NOTE - outer loop could be a map and done in parallel also
    for (const step of steps) {
      console.log('uploading step', step)
      const promises = stepImages.map(async img => {
        console.log('uploading image', img)
        const meta = await Storage.uploadFile(
          `uploads/howTos/${id}`,
          img.name,
          img.photoData,
        )
        return meta
      })
      console.log('running all promises')
      const imgMeta = await Promise.all(promises)
      console.log('imgMeta', imgMeta)
    }

    // const promises = steps.map(step =>
    //   step.images.map(async img => {
    //     const i = img as IConvertedFileMeta
    //     const meta = await Storage.uploadFile(
    //       `uploads/howTos/${id}`,
    //       i.name,
    //       i.photoData,
    //     )
    //     return meta
    //   }),
    // )
    return steps
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
