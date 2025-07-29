import { FieldArray } from 'react-final-form-arrays'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from 'oa-components'
import { LibraryStepField } from 'src/pages/Library/Content/Common/LibraryStep.field'
import { COMPARISONS } from 'src/utils/comparisons'
import { Box, Flex, Heading, Text } from 'theme-ui'

import { buttons as buttonsLabel, steps as stepsLabel } from '../../labels'

interface IPropsAnimation {
  children: React.ReactNode
}

const AnimationContainer = ({ children }: IPropsAnimation) => {
  const variants = {
    pre: {
      opacity: 0,
    },
    enter: {
      opacity: 1,
      duration: 0.2,
      display: 'block',
    },
    post: {
      display: 'none',
      duration: 0.2,
      top: '-100%',
    },
  }
  return (
    <motion.div
      layout
      initial="pre"
      animate="enter"
      exit="post"
      variants={variants}
    >
      {children}
    </motion.div>
  )
}

export const LibraryStepsContainerField = () => {
  return (
    <FieldArray name="steps" isEqual={COMPARISONS.step}>
      {({ fields }) => (
        <>
          <Box paddingTop={5}>
            <Heading as="h2">{stepsLabel.heading.title}</Heading>
            <Text
              sx={{ fontSize: 2 }}
              dangerouslySetInnerHTML={{
                __html: stepsLabel.heading.description as string,
              }}
            />
          </Box>
          <AnimatePresence>
            {fields.map((name, index: number) => (
              <AnimationContainer
                key={`${fields.value[index]._animationKey}-${index}`}
              >
                <LibraryStepField
                  key={`${fields.value[index]._animationKey}-${index}2`}
                  name={name}
                  index={index}
                  moveStep={(from, to) => {
                    if (to !== fields.length && to >= 0) {
                      // Move form fields
                      fields.move(from, to)
                    }
                  }}
                  images={fields.value[index].images || []}
                  existingImages={fields.value[index].existingImages || []}
                  onDelete={(fieldIndex: number) => {
                    fields.remove(fieldIndex)
                  }}
                />
              </AnimationContainer>
            ))}
          </AnimatePresence>
          <Flex>
            <Button
              type="button"
              icon="add"
              data-cy="add-step"
              mx="auto"
              mt={[10, 10, 20]}
              mb={[5, 5, 20]}
              variant="secondary"
              onClick={() => {
                fields.push({
                  title: '',
                  description: '',
                  images: [],
                  existingImages: [],
                })
              }}
            >
              {buttonsLabel.steps.add}
            </Button>
          </Flex>
        </>
      )}
    </FieldArray>
  )
}
