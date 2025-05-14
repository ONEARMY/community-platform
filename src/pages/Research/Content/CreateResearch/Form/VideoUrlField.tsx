import { Field } from 'react-final-form'
import { FieldInput } from 'oa-components'
import { COMPARISONS } from 'src/utils/comparisons'
import { Flex, Label } from 'theme-ui'

import { errors as errorsLabel, update as updateLabels } from '../../../labels'

const VideoUrlField = () => {
  const { title, placeholder } = updateLabels.videoUrl

  return (
    <Flex sx={{ flexDirection: 'column' }} mb={3}>
      <Label htmlFor={`videoUrl`} sx={{ mb: 2 }}>
        {title}
      </Label>
      <Field
        name="videoUrl"
        data-cy="videoUrl"
        component={FieldInput}
        placeholder={placeholder}
        validate={(url, values) => validateMedia(url, values)}
        validateFields={[]}
        isEqual={COMPARISONS.textInput}
      />
    </Flex>
  )
}

const validateMedia = (videoUrl: string, values: any) => {
  const { both, empty, invalidUrl } = errorsLabel.videoUrl
  const images = values.images
  const existingImages = values.existingImages

  if (videoUrl) {
    if ((images && images[0]) || (existingImages && existingImages[0])) {
      return both
    }
    const youtubeRegex = new RegExp(/(youtu\.be\/|youtube\.com\/watch\?v=)/gi)
    const urlValid = youtubeRegex.test(videoUrl)
    return urlValid ? null : invalidUrl
  }
  return (images && images[0]) || (existingImages && existingImages[0])
    ? null
    : empty
}

export default VideoUrlField
