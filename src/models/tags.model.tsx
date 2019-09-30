import { DBDoc } from './common.models'

// when tags are saved in things like how-tos, it is done so as a json object which
// maps tag keys to boolean values. e.g. [{tag1:true,tag2:true}]
// this is to allow easier query of multiple tags within the database (e.g. selectedTags.tag1==true && selectedTags.tag2==true)
export interface ISelectedTags {
  [key: string]: boolean
}

/* 
tags will be stored for use across the platform. it is intended that tags will be grouped by category to display together,
such as machines. It is also intended image will contain a binary string of the actual image data.
This should be kept small (max db size for an entry is around 1MB, but this should only be a few kb)
when building tag uploader it should enforce reasonable max size image (say 500px x 500px)
*/

export interface ITag extends DBDoc {
  categories: TagCategory[]
  label: string
  image: string
}

export type TagCategory = 'how-to' | 'event' | 'profile-expertise'
