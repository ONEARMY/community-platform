import { observable, action } from 'mobx'
import { afs } from '../../utils/firebase'
import {
  IHowto,
  IHowtoFormInput,
  IHowToStepFormInput,
  IHowtoStep,
} from 'src/models/howto.models'
import { Database } from 'src/stores/database'
import { IConvertedFileMeta } from 'src/components/ImageInput/ImageInput'
import { Storage } from '../storage'
import { ModuleStore } from '../common/module.store'
import { ISelectedTags } from 'src/models/tags.model'
import {
  IPropertyFilter,
  toFilterExpression,
  operationPredicates,
  filteredRows,
} from '../../pages/Discussions/common/filters'
export let FilterTypeMap = {
  tags: 'array',
}

export class HowtoStore extends ModuleStore {
  // we have two property relating to docs that can be observed
  @observable
  public activeHowto: IHowto | undefined
  @observable
  public allHowtos: IHowto[]
  @observable
  public uploadStatus: IHowToUploadStatus = getInitialUploadStatus()

  constructor() {
    // call constructor on common ModuleStore (with db endpoint), which automatically fetches all docs at
    // the given endpoint and emits changes as data is retrieved from cache and live collection
    super('v2_howtos')
    this.allDocs$.subscribe(docs => {
      this.allHowtos = docs as IHowto[]
    })
  }

  @action
  public async getDocBySlug(slug: string) {
    const collection = await Database.queryCollection<IHowto>(
      'v2_howtos',
      'slug',
      '==',
      slug,
    )
    const activeHowto = collection.length > 0 ? collection[0] : undefined
    this.activeHowto = activeHowto
    return activeHowto
  }
  @action
  public updateUploadStatus(update: keyof IHowToUploadStatus) {
    this.uploadStatus[update] = true
  }

  public generateID = () => {
    return Database.generateDocId('v2_howtos')
  }

  public async uploadHowTo(values: IHowtoFormInput, id: string) {
    console.log('uploading how-to', id)
    console.log('values', values)
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
      const processedFiles = await this.uploadHowToBatch(
        values.files as File[],
        id,
      )
      this.updateUploadStatus('Files')
      // populate DB
      const meta = Database.generateDocMeta('v2_howtos', id)
      // redefine howTo based on processing done above (should match stronger typing)
      const howTo: IHowto = {
        ...values,
        cover_image: processedCover,
        steps: processedSteps,
        files: processedFiles,
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

  public filterByTags(list: IHowto[], tags: ISelectedTags) {
    console.log('in howto store filterByTags', { list, tags }, list.length)

    const tagsNames = Object.keys(tags).map(key => key)

    // convert tags to filters, currently only the first of 'tags'
    // note that the property 'tags' has been mapped in filters.ts :: FilterTypeMap
    const filters: IPropertyFilter[] = [
      {
        prop: 'tags',
        filter: {
          op: 'has',
          value: tagsNames[0],
        },
      },
      /* example,
      {
        prop: 'title',
        filter: {
          op: 'contains',
          value: 'how-to'
        }        
      }
      */

      /* example,
      {
        prop: 'description',
        filter: {
          op: 'contains',
          value: 'not much'
        }        
      }
      */
    ]

    const expr = toFilterExpression(filters)
    console.log('filters', filters)
    console.log('expression', expr)
    const getCellValue = (row, columnName) => {
      const ret = row[columnName] // fancy, consider using get-value or jsonpath to pick a value inside objects via dot-notation
      // since this won't be an array for howto['tags'], please convert it; the filter system wants it
      if (columnName === 'tags') {
        return Object.keys(tags).map(key => key)
      }
      return ret
    }
    const getColumnPredicate = () => (value, filter) => {
      const filterFn = operationPredicates[filter.op]
      return filterFn(value, filter)
    }
    const out = filteredRows(list, expr, getCellValue, getColumnPredicate).rows
    console.log('out ' + out.length, out)
    return out
  }

  // go through each step, upload images and replace data
  private async processSteps(steps: IHowToStepFormInput[], id: string) {
    // NOTE - outer loop could be a map and done in parallel but for loop easier to manage
    const stepsWithImgMeta: IHowtoStep[] = []
    for (const step of steps) {
      const stepImages = step.images as IConvertedFileMeta[]
      const imgMeta = await this.uploadHowToBatch(stepImages, id)
      step.images = imgMeta
      stepsWithImgMeta.push({ ...step, images: imgMeta })
    }
    return stepsWithImgMeta
  }

  private uploadHowToFile(file: File | IConvertedFileMeta, id: string) {
    console.log('uploading file', file)
    // switch between converted file meta or standard file input
    let data: File | Blob = file as File
    if (file.hasOwnProperty('photoData')) {
      file = file as IConvertedFileMeta
      data = file.photoData
    }
    return Storage.uploadFile(
      `uploads/v2_howtos/${id}`,
      file.name,
      data,
      file.type,
    )
  }

  private async uploadHowToBatch(
    files: (File | IConvertedFileMeta)[],
    id: string,
  ) {
    const promises = files.map(async file => {
      return this.uploadHowToFile(file, id)
    })
    return Promise.all(promises)
  }

  private updateDatabase(howTo: IHowto) {
    return Database.setDoc(`v2_howtos/${howTo._id}`, howTo)
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
