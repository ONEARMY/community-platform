import { Field } from 'react-final-form'
import styled from '@emotion/styled'
import { FieldInput } from '@onearmy.apps/components'
import { Flex, Label } from 'theme-ui'

import { ImageInputField } from '../../../../../common/Form/ImageInput.field'
import { COMPARISONS } from '../../../../../utils/comparisons'
import { errors as errorsLabel, update as updateLabels } from '../../../labels'

const ImageInputFieldWrapper = styled.div`
  width: 150px;
  height: 100px;
  margin-right: 10px;
  margin-bottom: 6px;
`

const ImageField = ({ index }) => {
  return (
    <ImageInputFieldWrapper data-cy={`image-${index}`}>
      <Field
        hasText={false}
        name={`images[${index}]`}
        component={ImageInputField}
        isEqual={COMPARISONS.image}
        validateFields={['videoUrl']}
      />
    </ImageInputFieldWrapper>
  )
}

const ImagesField = ({ count }) => {
  const { title } = updateLabels.images
  return (
    <>
      <Label htmlFor={`images`} sx={{ mb: 2 }}>
        {title}
      </Label>
      <Flex
        sx={{
          flexDirection: ['column', 'row'],
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
        mb={3}
      >
        {[...Array(count)].map((_, i) => (
          <ImageField index={i} key={`image-${i}`} />
        ))}
      </Flex>
    </>
  )
}

const validateMedia = (videoUrl: string, values: any) => {
  const { both, empty, invalidUrl } = errorsLabel.videoUrl
  const images = values.images

  if (videoUrl) {
    if (images && images[0]) {
      return both
    }
    const youtubeRegex = new RegExp(/(youtu\.be\/|youtube\.com\/watch\?v=)/gi)
    const urlValid = youtubeRegex.test(videoUrl)
    return urlValid ? null : invalidUrl
  }
  return images && images[0] ? null : empty
}

const VideoUrlField = () => {
  const { title, placeholder } = updateLabels.videoUrl

  return (
    <Flex sx={{ flexDirection: 'column' }} mb={3}>
      <Label htmlFor={`videoUrl`} sx={{ mb: 2 }}>
        {title}
      </Label>
      <Field
        name={`videoUrl`}
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

export const MediaFields = ({ values }) => {
  const countImageFields = values?.images ? values.images.length + 1 : 4

  return (
    <>
      <ImagesField count={countImageFields} />
      <VideoUrlField />
    </>
  )
}
