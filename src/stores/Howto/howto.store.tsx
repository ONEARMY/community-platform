import { observable, action } from 'mobx'
import { afs } from '../../utils/firebase'
import {
  IHowto,
  IHowtoFormInput,
  IHowToStepFormInput,
  IHowtoStep,
} from 'src/models/howto.models'
import { Database } from 'src/stores/database'
import { stripSpecialCharacters } from 'src/utils/helpers'
import { IConvertedFileMeta } from 'src/components/ImageInput/ImageInput'
import { Storage, IUploadedFileMeta } from '../storage'
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
      .collection('howtosV1')
      .orderBy('_created', 'desc')
      .get()

    this.allHowtos = ref.docs.map(doc => doc.data() as IHowto)
  }
  @action
  public async getDocBySlug(slug: string) {
    const ref = afs
      .collection('howtosV1')
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
      await Database.checkSlugUnique('howtosV1', slug)
    } catch (e) {
      return 'How-to titles must be unique, please try being more specific'
    }
  }

  public validateTitle = async (value: any, meta?: FieldState) => {
    if (meta && (!meta.dirty && meta.valid)) {
      return undefined
    }
    if (value) {
      const error = this.isSlugUnique(
        stripSpecialCharacters(value).toLowerCase(),
      )
      return error
    } else if ((meta && (meta.touched || meta.visited)) || value === '') {
      return 'A title for your how-to is required'
    }
    return undefined
  }

  public generateID = () => {
    return Database.generateDocId('howtosV1')
  }

  public async uploadHowTo(values: IHowtoFormInput, id: string) {
    try {
      // upload images
      const processedCover = await this.uploadHowToFile(
        values.cover_image[0],
        id,
      )
      this.updateUploadStatus('Cover')
      const processedSteps = await this.processSteps(values.steps, id)
      this.updateUploadStatus('Step Images')
      // upload files
      const processedFiles = await this.uploadBatchHowToFiles(
        values.tutorial_files as IConvertedFileMeta[],
        id,
      )
      this.updateUploadStatus('Files')
      // populate DB
      const meta = Database.generateDocMeta('howtosV1', id)
      // redefine howTo based on processing done above (should match stronger typing)
      const howTo: IHowto = {
        ...values,
        cover_image: processedCover,
        steps: processedSteps,
        tutorial_files: processedFiles,
        ...meta,
      }
      console.log('populating database', howTo)
      this.updateDatabase(howTo)
      this.updateUploadStatus('Database')
      // complete
      this.updateUploadStatus('Complete')
      console.log('post added')
      this.activeHowto = howTo
      return howTo
    } catch (error) {
      console.log('error', error)
      throw new Error(error.message)
    }
  }

  // go through each step, upload images and replace data
  private async processSteps(steps: IHowToStepFormInput[], id: string) {
    // NOTE - outer loop could be a map and done in parallel but for loop easier to manage
    const stepsWithImgMeta: IHowtoStep[] = []
    for (const step of steps) {
      const stepImages = step.images as IConvertedFileMeta[]
      const imgMeta = await this.uploadBatchHowToFiles(stepImages, id)
      step.images = imgMeta
      stepsWithImgMeta.push({ ...step, images: imgMeta })
    }
    return stepsWithImgMeta
  }

  // upload files to individual howTo storage folder
  private uploadHowToFile(file: IConvertedFileMeta, id: string) {
    return Storage.uploadFile(
      `uploads/howtosV1/${id}`,
      file.name,
      file.photoData,
    )
  }

  // upload multiple files in parallel
  private async uploadBatchHowToFiles(files: IConvertedFileMeta[], id: string) {
    const promises = files.map(async file => {
      return this.uploadHowToFile(file, id)
    })
    return Promise.all(promises)
  }

  private updateDatabase(howTo: IHowto) {
    return Database.setDoc(`howtosV1/${howTo._id}`, howTo)
  }
}

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
