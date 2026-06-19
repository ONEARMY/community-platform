import {FieldValidator} from 'final-form';
import {Button, FieldInput} from 'oa-components';
import {Field, useForm} from 'react-final-form';
import {FieldArray} from 'react-final-form-arrays';
import {FormFieldWrapper} from 'src/pages/common/FormFields';
import {NEWS_MAX_TITLE_LENGTH, NEWS_MIN_TITLE_LENGTH} from 'src/pages/News/constants';
import {Card, Flex, Heading, Label} from "@theme-ui/components";

interface IProps {
  validate: FieldValidator<string>;
  pollData: PollData | null;
}

export interface PollData {
  title: string;
  options: string[];
  allowMultipleVotes: boolean;
}

export const PollField = ({ validate }: IProps) => {
  const name = "poll"
  const form = useForm();
  const poll = form.getState().values?.poll;


  return (
    <>
      {!poll ? (
          <Button
            type="button"
            sx={{ width: 'fit-content ', marginTop: 3}}
            variant="outline"
            icon="difficulty"
            onClick={() =>
              form.change('poll', {
                title: '',
                options: ['', '', ''],
                allowMultipleVotes: false,
              })
            }
          >
            Add poll
          </Button>
        ) : (
    <Card sx={{borderColor: 'offWhite'}}>
      <Flex p={3} sx={{ flexDirection: 'column', gap: 3}}>
        <Flex p={0}>
          <Heading as="h3" variant="small" sx={{ flex: 1 }} mb={3}>
            Add poll
          </Heading>
          <Button
            type="button"
            variant="subtle"
            icon="close"
            showIconOnly={true}
            onClick={() => form.change('poll', null)}
          />
        </Flex>
        <FormFieldWrapper htmlFor="poll.title" text="Poll title" required>
          <Field
            data-cy={`field-${name}`}
            name="poll.title"
            id="poll.title"
            validate={validate}
            component={FieldInput}
            placeholder="Add a title for your poll"
            minLength={NEWS_MIN_TITLE_LENGTH}
            maxLength={NEWS_MAX_TITLE_LENGTH}
            // showCharacterCount
            onBlur/>
        </FormFieldWrapper>

        <FormFieldWrapper htmlFor="poll.options" text="Poll options">
          <FieldArray name="poll.options">
            {({ fields }) => (
              <>
                {fields.map((name, index) => (
                  <div key={name}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginTop: 3
                    }}
                  >
                    <Field
                      name={name}
                      component={FieldInput}
                      placeholder={`Option ${index + 1}`}
                    />
                    <Button
                      type="button"
                      variant="subtle"
                      icon="close-modal"
                      showIconOnly={true}
                      onClick={() => fields.remove(index)}
                    />
                  </div>
                ))}
                <Button
                  variant="outline"
                  type="button"
                  sx={{ width: 'fit-content ', marginTop: 3}}
                  icon="add"
                  onClick={() => fields.push('')}
                >
                  Add option
                </Button>
              </>
            )}
          </FieldArray>
          <Label sx={{marginTop: 3, gap:1}}>
            <Field
              name="poll.allowMultipleVotes"
              component="input"
              type="checkbox"/>
            Allow users to vote on more than one option
          </Label>
        </FormFieldWrapper>
      </Flex>
    </Card> )}
    </>
  );
};
