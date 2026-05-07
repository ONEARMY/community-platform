import { Card, Flex, Heading, Text } from 'theme-ui';

export interface IProps {
  title: string;
  steps: React.ReactElement[];
}

export const Guidelines = ({ title, steps }: IProps) => {
  return (
    <Card>
      <Flex sx={{ flexDirection: 'column', padding: [2, 3, 4], gap: 2 }}>
        <Heading as="h2" variant="h2" sx={{ paddingBottom: 1 }}>
          {title}
        </Heading>

        {steps.map((step, index) => {
          return (
            <Text variant="auxiliary" sx={{ fontSize: 2 }} key={index}>
              {`${index + 1}. `} {step}
            </Text>
          );
        })}
      </Flex>
    </Card>
  );
};
