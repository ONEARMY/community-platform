import { Checkbox, Flex, Heading, Label, Radio, Text } from '@theme-ui/components';
import { Button } from 'oa-components';
import { Profile } from 'oa-shared';
import { PollDTO, PollOptionDTO } from 'oa-shared/models/poll';
import { useMemo, useState } from 'react';
import { Form } from 'react-final-form';
import { useToast } from '../../../common/Toast';
import { pollService } from './poll.service';

interface IProps {
  pollData: PollDTO;
  profile: Profile | undefined;
}

export const PollDisplay = ({ pollData, profile }: IProps) => {
  const [poll, setPoll] = useState(pollData);
  const toast = useToast();

  const seeResults = useMemo(() => {
    return poll.options.some((o) => (o.voteCount ?? 0) > 0);
  }, poll.options);

  const activeVoting = useMemo(() => {
    return !!(profile && !poll.hasVoted);
  }, [profile, poll.hasVoted]);

  const totalVotes = useMemo(() => {
    return poll.options.reduce((sum, o) => sum + (o.voteCount ?? 0), 0);
  }, poll.options);

  const ableToSubmit = (values: any) => !activeVoting || values?.selectedOptionIds?.length < 1;

  const onSubmit = async (values: { selectedOptionIds: number[] }) => {
    if (ableToSubmit(values)) {
      return;
    }
    try {
      await pollService.voteOnPoll(pollData, values.selectedOptionIds);

      const updatedPoll = await pollService.getPoll(pollData);
      if (updatedPoll) {
        setPoll(updatedPoll);
      }
    } catch (error) {
      toast.error('Oops! Your vote didn’t go through');
      console.error({ error });
    }
  };

  const getPercentage = (option: PollOptionDTO) => {
    const thisResult = poll.options.find((o) => o.id == option.id)?.voteCount ?? 0;
    return Math.round((thisResult / totalVotes) * 100);
  };

  return (
    <>
      <Form
        onSubmit={onSubmit}
        initialValues={{
          selectedOptionIds: [],
        }}
      >
        {({ handleSubmit, form, values }) => {
          const selectSingle = (option: PollOptionDTO) => {
            if (!option.id) {
              return;
            }
            form.change('selectedOptionIds', [option.id]);
          };

          const toggle = (option: PollOptionDTO) => {
            if (!option.id) {
              return;
            }
            const current = values.selectedOptionIds || [];

            const updated = current.includes(option.id)
              ? current.filter((x: number | undefined) => x !== option.id)
              : [...current, option.id];

            form.change('selectedOptionIds', updated);
          };

          return (
            <form onSubmit={handleSubmit}>
              <Flex sx={{ flexDirection: 'column', gap: 2 }} data-testid="pollDisplay">
                <Heading as="h3" variant="small">
                  {poll.title}
                </Heading>

                {!poll.singleChoice && (
                  <Text variant="quiet" sx={{ fontSize: 2 }}>
                    You can vote on more than one option
                  </Text>
                )}
                <Flex sx={{ flexDirection: 'column', gap: 1 }}>
                  {poll.options.map((option, index) => {
                    if (!option.id) {
                      return;
                    }
                    const selected = values.selectedOptionIds?.includes(option.id);

                    return (
                      <Label
                        data-cy={`poll-option-${index}`}
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
                        <Flex
                          sx={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: seeResults ? `${getPercentage(option)}%` : '0%',
                            backgroundColor: 'highlight',
                            opacity: 0.2,
                            pointerEvents: 'none',
                            transition: 'width 0.5s ease',
                          }}
                        />

                        <Flex
                          sx={{
                            position: 'relative',
                            width: '100%',
                            alignItems: 'center',
                            gap: 1,
                          }}
                          data-testid="pollOption"
                        >
                          {poll.singleChoice ? (
                            <Radio
                              disabled={!activeVoting}
                              sx={{
                                'input:checked ~ &': { color: 'highlight' },
                                'input:focus ~ &': {
                                  backgroundColor: 'transparent',
                                  color: 'highlight',
                                },
                              }}
                              checked={selected || option.wasVotedByUser}
                              onChange={() => selectSingle(option)}
                            />
                          ) : (
                            <Checkbox
                              disabled={!activeVoting}
                              checked={selected || option.wasVotedByUser}
                              sx={{
                                'input:checked ~ &': { color: 'highlight' },
                                'input:focus ~ &': {
                                  backgroundColor: 'transparent',
                                  color: 'highlight',
                                },
                              }}
                              onChange={() => toggle(option)}
                            />
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

                <Button
                  data-cy={`submit-vote`}
                  type="submit"
                  variant="outline"
                  disabled={ableToSubmit(values)}
                  sx={{ width: 'fit-content' }}
                >
                  {poll.singleChoice ? 'Submit vote' : 'Submit votes'}
                </Button>
              </Flex>
            </form>
          );
        }}
      </Form>
      {seeResults && (
        <Text variant="quiet" sx={{ fontSize: 2, marginTop: 2, marginBottom: 3 }}>
          {totalVotes} {totalVotes > 1 ? 'votes' : 'vote'}
        </Text>
      )}
    </>
  );
};
