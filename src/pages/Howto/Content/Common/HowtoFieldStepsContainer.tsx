import { FieldArray } from 'react-final-form-arrays'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from 'oa-components'
import { HowtoFieldStep } from 'src/pages/Howto/Content/Common/HowtoFieldStep'
import { COMPARISONS } from 'src/utils/comparisons'
import { Box, Flex, Heading, Text } from 'theme-ui'

import { buttons, steps } from '../../labels'

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

export const HowtoFieldStepsContainer = () => {
  return (
    <FieldArray name="steps" isEqual={COMPARISONS.step}>
      {({ fields }) => (
        <>
          <Box paddingTop={5}>
            <Heading as="h2">{steps.heading.title}</Heading>
            <Text
              sx={{ fontSize: 2 }}
              dangerouslySetInnerHTML={{
                __html: steps.heading.description as string,
              }}
            />
          </Box>
          <AnimatePresence>
            {fields.map((name, index: number) => (
              <AnimationContainer
                key={`${fields.value[index]._animationKey}-1`}
              >
                <HowtoFieldStep
                  key={`${fields.value[index]._animationKey}-2`}
                  step={name}
                  index={index}
                  moveStep={(from, to) => {
                    if (to !== fields.length) {
                      fields.move(from, to)
                    }
                  }}
                  images={fields.value[index].images}
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
                  text: '',
                  images: [],
                  // HACK - need unique key, this is a rough method to generate form random numbers
                  _animationKey: `unique${Math.random()
                    .toString(36)
                    .substring(7)}`,
                })
              }}
            >
              {buttons.steps.add}
            </Button>
          </Flex>
        </>
      )}
    </FieldArray>
  )
}
