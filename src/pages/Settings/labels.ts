import { MAX_PIN_LENGTH } from './constants'

import type { ILabels } from 'src/common/Form/types'

export const buttons = {
  changeEmail: 'Change email',
  changePassword: 'Change password',
  deleteLink: {
    message: 'Are you sure you want to delete this link?',
    text: 'Delete',
  },
  guidelines: 'Check out our guidelines',
  link: {
    add: 'Add link',
    type: 'type',
  },
  map: 'Add a map pin',
  removePin: 'Remove map pin',
  save: 'Save profile',
  success: 'Profile saved successfully',
  submit: 'Submit',
}

export const defaultError = 'Make sure this field is filled correctly'

export const fields: ILabels = {
  activities: {
    description: 'Not sure about your focus?',
    error: 'Please select a focus',
    title: 'What is your main activity?',
  },
  about: {
    title: 'Tell us a bit about yourself',
    placeholder:
      "Describe in details what you do and who you are. Write in English otherwise your profile won't be approved.",
  },
  country: {
    title: 'Your location',
  },
  coverImages: {
    description:
      'The cover images are shown in your profile and helps us evaluate your account. Make sure the first image shows your space. Best size is 1920x1080.',
    title: 'Add image',
  },
  deleteAccount: {
    description: 'Please reach out to support.',
    title: 'Would you like to delete your account?',
  },
  displayName: {
    title: 'Display Name',
  },
  email: {
    title: 'Current email address',
  },
  emailNotifications: {
    description:
      "We send an email with all the notifications you've missed. Select how often you want to receive this",
    title: 'Email notifications (beta)',
  },
  expertise: {
    description: 'Choose at least one expertise',
    title: 'What are you specialised in ?',
  },
  links: {
    placeholder: 'Link',
    title: 'Contacts & links',
  },
  location: {
    error: 'Please select your location',
    title: 'Your workspace location',
  },
  mapPinDescription: {
    placeholder: `Short description of your pin (max ${MAX_PIN_LENGTH} characters)`,
    title: 'Short description of your pin',
  },
  newEmail: {
    placeholder: 'New email address',
    title: 'New email address',
  },
  newPassword: {
    title: 'New password',
  },
  oldPassword: {
    title: 'Old password',
  },
  openingHours: {
    description: 'add opening day',
    title: 'Opening time',
  },
  password: {
    title: 'Password',
  },
  plastic: {
    description: 'Choose at least one plastic type',
    title: 'Plastic types accepted',
  },
  repeatPassword: {
    title: 'Repeat new password',
  },
  workspaceType: {
    description: 'What kind of Precious Plastic workspace do you run?',
    error: 'Please select your workspace type',
    title: 'Workspace',
  },
}

export const headings = {
  accountSettings: 'Account settings',
  collection: 'Collection',
  createProfile: 'Create profile',
  editProfile: 'Edit profile',
  expertise: 'Expertise',
  focus: 'Focus',
  infos: 'Infos',
  map: {
    description:
      'Add yourself to the map as an individual who wants to get started. Find local community members and meetup to join forces and collaborate.',
    title: 'Add yourself to the map!',
  },
  workspace: {
    description:
      'In order to have your pin accepted on our map you have to collect at least 6 stars in the Ally Checklist. Learn more about the Community Program and how you can join.',
    title: 'Your map pin',
  },
}
