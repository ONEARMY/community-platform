import { animated, useTransition } from '@react-spring/web';
import { Button } from 'oa-components';
import { FieldArray } from 'react-final-form-arrays';
import { LibraryStepField } from 'src/pages/Library/Content/Common/LibraryStep.field';
import { COMPARISONS } from 'src/utils/comparisons';
import { Box, Flex, Heading, Text } from 'theme-ui';

import { buttons as buttonsLabel, steps as stepsLabel } from '../../labels';

interface IPropsAnimation {
  children: React.ReactNode;
  animationKey: string;
}

const AnimatedStep = ({ children, animationKey }: IPropsAnimation) => {
  const transitions = useTransition(true, {
    keys: animationKey,
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0, display: 'none' },
    config: { duration: 200 },
  });

  return (
    <>
      {transitions((style, item) => item && <animated.div style={style}>{children}</animated.div>)}
    </>
  );
};

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
          {fields.map((name, index: number) => (
            <AnimatedStep
              key={`${fields.value[index]._animationKey}-${index}`}
              animationKey={`${fields.value[index]._animationKey}-${index}`}
            >
              <LibraryStepField
                key={`${fields.value[index]._animationKey}-${index}2`}
                name={name}
                index={index}
                moveStep={(from, to) => {
                  if (to !== fields.length && to >= 0) {
                    // Move form fields
                    fields.move(from, to);
                  }
                }}
                images={fields.value[index].images || []}
                existingImages={fields.value[index].existingImages || []}
                onDelete={(fieldIndex: number) => {
                  fields.remove(fieldIndex);
                }}
              />
            </AnimatedStep>
          ))}
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
                });
              }}
            >
              {buttonsLabel.steps.add}
            </Button>
          </Flex>
        </>
      )}
    </FieldArray>
  );
};
