import {Text, Alert } from 'theme-ui'

export const FormSubmitResult = (props) => {
  return (
    <Alert variant={props.valid? 'success': 'failure'}>
      {
        props.valid ?
        <Text>Profile Saved successfully</Text>
        :
        <Text>Ouch, something's wrong. Make sure all fields are filled correctly to save your profile</Text>
      }
    </Alert>
  )
}
