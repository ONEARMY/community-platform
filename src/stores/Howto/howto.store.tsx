import { observable, action, computed } from 'mobx'
import {
  IHowto,
  IHowtoFormInput,
  IHowToStepFormInput,
  IHowtoStep,
  IHowtoDB,
} from 'src/models/howto.models'
import { IConvertedFileMeta } from 'src/components/ImageInput/ImageInput'
import { IUploadedFileMeta } from '../storage'
import { ModuleStore } from '../common/module.store'
import { ISelectedTags } from 'src/models/tags.model'
import { RootStore } from '..'
import { IUser } from 'src/models/user.models'

const COLLECTION_NAME = 'v2_howtos'

export class HowtoStore extends ModuleStore {
  // we have two property relating to docs that can be observed
  @observable
  public activeHowto: IHowtoDB | undefined
  @observable
  public allHowtos: IHowtoDB[]
  @observable
  public selectedTags: ISelectedTags
  @observable
  public uploadStatus: IHowToUploadStatus = getInitialUploadStatus()
  constructor(rootStore: RootStore) {
    // call constructor on common ModuleStore (with db endpoint), which automatically fetches all docs at
    // the given endpoint and emits changes as data is retrieved from cache and live collection
    super(rootStore, COLLECTION_NAME)
    this.allDocs$.subscribe(docs => {
      this.allHowtos = docs as IHowtoDB[]
    })
    this.selectedTags = {}
  }

  @action
  public async getDocBySlug(slug: string) {
    const collection = await this.db
      .collection<IHowto>(COLLECTION_NAME)
      .getWhere('slug', '==', slug)
    const activeHowto = collection.length > 0 ? collection[0] : undefined
    this.activeHowto = activeHowto
    return activeHowto
  }
  @action
  public updateUploadStatus(update: keyof IHowToUploadStatus) {
    this.uploadStatus[update] = true
  }

  @computed get filteredHowtos() {
    return this.filterCollectionByTags(this.allHowtos, this.selectedTags)
  }

  public updateSelectedTags(tagKey: ISelectedTags) {
    this.selectedTags = tagKey
  }

  // upload a new or update an existing how-to
  public async uploadHowTo(values: IHowtoFormInput | IHowtoDB) {
    // create a reference either to the existing document (if editing) or a new document if creating
    const dbRef = this.db
      .collection<IHowto>(COLLECTION_NAME)
      .doc((values as IHowtoDB)._id)
    const id = dbRef.id
    const user = this.activeUser as IUser
    try {
      // upload any pending images, avoid trying to re-upload images previously saved
      // if cover already uploaded stored as object not array
      // file and step image re-uploads handled in uploadFile script
      let processedCover
      if (!values.cover_image.hasOwnProperty('downloadUrl')) {
        processedCover = await this.uploadFileToCollection(
          values.cover_image,
          COLLECTION_NAME,
          id,
        )
      } else {
        processedCover = values.cover_image as IUploadedFileMeta
      }

      this.updateUploadStatus('Cover')
      const processedSteps = await this.processSteps(values.steps, id)
      this.updateUploadStatus('Step Images')
      // upload files
      const processedFiles = await this.uploadCollectionBatch(
        values.files as File[],
        COLLECTION_NAME,
        id,
      )
      this.updateUploadStatus('Files')
      // populate DB
      // redefine howTo based on processing done above (should match stronger typing)
      const howTo: IHowto = {
        ...values,
        _createdBy: user.userName,
        cover_image: processedCover,
        steps: processedSteps,
        files: processedFiles,
      }
      console.log('populating database', howTo)
      // set the database document
      await dbRef.set(howTo)
      this.updateUploadStatus('Database')
      // complete
      this.updateUploadStatus('Complete')
      console.log('post added')
      this.activeHowto = await dbRef.get()
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
      // determine any new images to upload
      const stepImages = step.images as IConvertedFileMeta[]
      const imgMeta = await this.uploadCollectionBatch(
        stepImages,
        COLLECTION_NAME,
        id,
      )
      step.images = imgMeta
      stepsWithImgMeta.push({
        ...step,
        images: imgMeta.map(f => {
          if (f === undefined) {
            return null
          }

          return f
        }),
      })
    }
    return stepsWithImgMeta
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
    'Step Images': false,
    Files: false,
    Database: false,
    Complete: false,
  }
  return status
}
