import { Box, Flex, Text } from 'theme-ui';

export interface IProps {
  steps: string[];
  activeStep: number;
}

export const Stepper = ({ steps, activeStep }: IProps) => {
  return (
    <Flex data-cy="Stepper" sx={{ gap: 3, width: '100%' }}>
      {steps.map((step, index) => {
        const isDone = index < activeStep;
        const isActive = index === activeStep;

        return (
          <Flex
            key={step}
            data-cy={`Stepper-step-${index}`}
            sx={{ flex: 1, flexDirection: 'column', gap: 2, alignItems: 'center' }}
          >
            <Box
              sx={{
                width: '100%',
                height: '4px',
                borderRadius: 2,
                backgroundColor: isDone || isActive ? 'green' : 'softblue',
              }}
            />
            <Text
              sx={{
                fontSize: 1,
                color: isActive ? 'black' : 'grey',
                fontWeight: isActive ? 'bold' : 'normal',
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
