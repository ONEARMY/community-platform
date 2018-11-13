// when tags are saved in things like documentation tutorials, it is done so as a json object which
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

// when we query tag from the database it does not have a _key field. This can be populated after
// to produce what we want for the Tag interface
export interface ITag extends ITagQuery {
  _key: string
}

export interface ITagQuery {
  category: string
  label: string
  image: string
  _created: Date
  _modified: Date
  _selected?: boolean
}
