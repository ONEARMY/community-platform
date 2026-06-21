import { Button } from 'oa-components';
import { Form } from 'react-final-form';
import { Checkbox, Flex, Heading, Label, Radio, Text } from '@theme-ui/components';

export interface PollFormData {
  title: string;
  options: PollOption[];
  allowMultipleVotes: boolean;
}

export interface PollOption {
  id: number;
  description: string;
}

interface IProps {
  pollData: PollFormData | null;
}

export const PollForm = ({ pollData }: IProps) => {
  if (!pollData) return null;

  const onSubmit = async (values: any) => {
    await new Promise((r) => setTimeout(r, 500));
    console.log('submitted:', values);
  };

  return (
    <>
      <Form
        onSubmit={onSubmit}
        initialValues={{
          selectedOptionIds: [],
        }}
      >
        {({handleSubmit, form, values}) => {

          const selectSingle = (id: number) => {
            form.change('selectedOptionIds', [id]);
          };

          const toggle = (id: number) => {
            const current = values.selectedOptionIds || [];

            const updated = current.includes(id)
              ? current.filter(x => x !== id)
              : [...current, id];

            form.change('selectedOptionIds', updated);
          };
          console.log(JSON.stringify(values, null, 2)) // TODO: remove after dev

          return (
            <form onSubmit={handleSubmit}>
              <Flex sx={{flexDirection: 'column', gap: 2}}>
                <Heading as="h3" variant="small">
                  {pollData.title}
                </Heading>

                {pollData.allowMultipleVotes && (
                  <Text variant="quiet" sx={{ fontSize: 2}}>
                    You can vote on more than one option
                  </Text>)
                }
                <Flex sx={{flexDirection: 'column', gap: 1}}>
                  {pollData.options.map((option) => {
                    const selected = values.selectedOptionIds?.includes(option.id);

                    return (
                      <Label
                        key={option.id}
                        sx={{
                          borderRadius: 1,
                          padding: 2,
                          alignItems: 'center',
                          gap: 1,
                          backgroundColor: 'background',
                        }}
                      >
                        {pollData.allowMultipleVotes ? (
                          <Checkbox
                            sx={{
                              'input:checked ~ &': {color: 'highlight',},
                              'input:focus ~ &': {backgroundColor: 'white', color: 'highlight'}
                            }}
                            onChange={() => toggle(option.id)}/>
                        ) : (
                          <Radio
                            sx={{
                              'input:checked ~ &': {color: 'highlight',},
                              'input:focus ~ &': {backgroundColor: 'white',}
                            }}
                            checked={selected}
                            onChange={() => selectSingle(option.id)}/>
                        )}
                        {option.description}
                      </Label>
                    );
                  })}
                </Flex>

                <Button type="submit" variant="outline" sx={{width: 'fit-content'}}>
                  {pollData.allowMultipleVotes ? ("Submit votes") : ("Submit vote")}
                </Button>

                {/*/!* debug *!/*/}
                {/*<pre>{JSON.stringify(values, null, 2)}</pre>*/}
              </Flex>
            </form>
          );
        }}
      </Form>
      <Text variant="quiet" sx={{ fontSize: 2, marginTop:2, marginBottom:3}}>
        123 votes
      </Text>
    </>
  );
};