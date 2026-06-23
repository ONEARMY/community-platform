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

export interface PollOptionVotes {
  option: PollOption;
  votes: number;
}

interface IProps {
  pollData: PollFormData | null;
}

export const PollForm = ({ pollData }: IProps) => {
  if (!pollData) return null;

  const results: PollOptionVotes[] = [];
  let seeResults = false; // TODO replace with check for (is admin || has already voted)
  let activeVoting = true; // TODO replace with (is logged in && has yet to vote)

  const onSubmit = async (values: any) => {
    if (isFormDisabled(values)) return;
    await new Promise((r) => setTimeout(r, 50));
    activeVoting = false;
    console.log('submitted:', values);
    await getResults();
  };

  const getResults = async () => {
    await new Promise((r) => setTimeout(r, 50));

    pollData.options.map((option) => {
      results.push({option: option, votes: Math.floor(Math.random() * (20)) + 1});
    });
    seeResults = true;
  }

  const getPercentage = (option: PollOption) => {
    const allVotes = results.reduce((sum, r) => sum + r.votes, 0);
    const thisResult = results.filter(r => r.option == option)[0]
    console.log("all votes: ", allVotes);
    let percentage = thisResult?.votes / allVotes;
    console.log("percentage: ", percentage);
    return Math.round((percentage * 100));
  }

  const isFormDisabled = (values: any) => {
    return values?.selectedOptionIds?.length < 1 || !activeVoting;
  }

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
                          position: 'relative',
                          overflow: 'hidden',
                          borderRadius: 1,
                          padding: 2,
                          alignItems: 'center',
                          gap: 1,
                          backgroundColor: 'background',
                        }}
                      >
                        <Flex sx={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: seeResults ? `${getPercentage(option)}%` : '0%',
                            backgroundColor: 'highlight',
                            opacity: 0.2,
                            pointerEvents: 'none',
                            transition: 'width 0.5s ease',
                          }}/>

                        <Flex
                          sx={{
                            position: 'relative',
                            width: '100%',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          {pollData.allowMultipleVotes ? (
                            <Checkbox
                              disabled={!activeVoting}
                              sx={{
                                'input:checked ~ &': {color: 'highlight',},
                                'input:focus ~ &': {backgroundColor: 'white', color: 'highlight'}
                              }}
                              onChange={() => toggle(option.id)} />
                          ) : (
                            <Radio
                              disabled={!activeVoting}
                              sx={{
                                'input:checked ~ &': {color: 'highlight',},
                                'input:focus ~ &': {backgroundColor: 'white',}
                              }}
                              checked={selected}
                              onChange={() => selectSingle(option.id)} />
                          )}

                          <Text>{option.description}</Text>

                          {seeResults && (
                            <Text
                              variant="quiet"
                              sx={{
                                fontSize: 2,
                                ml: 'auto',
                              }}
                            >
                              {getPercentage(option)}%
                            </Text>
                          )}
                        </Flex>
                      </Label>
                    );
                  })}
                </Flex>

                <Button type="submit"
                        variant="outline"
                        disabled={isFormDisabled(values)}
                        sx={{width: 'fit-content'}}
                >
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