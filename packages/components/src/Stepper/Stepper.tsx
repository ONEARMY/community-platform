import { Box, Flex, Text } from 'theme-ui';

export interface IProps {
  steps: string[];
  activeStep: number;
}

export const Stepper = ({ steps, activeStep }: IProps) => {
  return (
    <Flex data-cy="Stepper" sx={{ gap: 2, width: '100%' }}>
      {steps.map((step, index) => {
        const isDone = index < activeStep;
        const isActive = index === activeStep;
        const isReached = isDone || isActive;

        return (
          <Flex
            key={step}
            data-cy={`Stepper-step-${index}`}
            sx={{ flex: 1, flexDirection: 'column', gap: 2, alignItems: 'center' }}
          >
            <Box
              sx={{
                width: '100%',
                height: '5px',
                borderRadius: 2,
                backgroundColor: isReached ? 'green' : 'softblue',
              }}
            />
            <Text
              sx={{
                fontSize: 3,
                lineHeight: 1,
                color: isReached ? 'black' : 'grey',
              }}
            >
              {step}
            </Text>
          </Flex>
        );
      })}
    </Flex>
  );
};
