import { MAX_PIN_LENGTH } from './constants'

import type { ILabels } from 'src/common/Form/types'

export const buttons = {
  changeEmail: 'Change email',
  changePassword: 'Change password',
  deleteLink: {
    message: 'Are you sure you want to delete this link?',
    text: 'Delete',
  },
  impact: {
    create: 'Add data now',
    edit: 'Edit data',
    expandOpen: 'Expand and edit',
    expandClose: 'Close',
    save: 'Save impact data',
  },
  guidelines: 'Check out our guidelines',
  link: {
    add: 'Add another link',
    type: 'type',
  },
  map: 'Add a map pin',
  notifications: 'Update notifications',
  editPin: 'Save map pin',
  removePin: 'Remove map pin',
  save: 'Save profile',
  success: 'Profile saved successfully',
  submit: 'Submit',
  submitNewEmail: 'Save new email address',
  submitNewPassword: 'Save new password',
}

export const fields: ILabels = {
  activities: {
    description: 'Choose your main activity. Not sure?',
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
    description:
      "Thought about adding yourself to our map? If you do, we'll automatically set this field.",
  },
  coverImages: {
    description:
      "They're shown at the top your profile and helps us evaluate your account. Make sure the first image shows your space. Best size is 1920x1080.",
    title: 'Add profile cover image(s)',
  },
  userImage: {
    description:
      'Visible on your profile and comments, best to upload as a square image.',
    title: 'Add an avatar',
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
      "We can send you emails with all the notifications you've missed.",
    title: 'Email notifications',
  },
  expertise: {
    description: 'Choose at least one expertise',
    title: 'What are you specialised in ?',
  },
  impact: {
    description:
      "Let's track our collective positive impact! Add data about your recycling work and show the world the power of a movement of small scale recyclers!",
    title: 'Positive impact 🤙',
  },
  links: {
    placeholder: 'Link',
    title: 'Contacts & links',
  },
  location: {
    error: 'Please select your location',
    title: 'Your location (flag)',
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
    title: 'Opening time(s)',
  },
  password: {
    title: 'Password',
  },
  plastic: {
    description: 'Choose at least one plastic type',
    title: 'Plastic types accepted',
  },
  publicContentPreference: {
    title: 'Contact Preference',
    description:
      "Regardless of your email notifications setting, do you want people to be able to contact you? We'll email you their message whenever they do.",
    placeholder: 'I want people to be able to contact me',
  },
  repeatNewPassword: {
    title: 'Repeat new password',
  },
  workspaceType: {
    description: 'What kind of Precious Plastic workspace do you run?',
    error: 'Please select your workspace type',
    title: 'Workspace',
  },
}

export const form = {
  defaultError: 'Make sure this field is filled correctly',
  saveSuccess: 'Yay! Impact data saved.',
}

export const headings = {
  accountSettings: 'Account settings',
  changeEmail: 'Change Email',
  changePassword: 'Change Password',
  collection: 'Collection',
  createProfile: 'Create profile',
  editProfile: 'Edit profile',
  expertise: 'Expertise',
  focus: 'Focus',
  images: 'Images',
  infos: 'Infos',
  map: {
    description:
      'Add yourself to the map as an individual who wants to get started. Find local community members and meetup to join forces and collaborate.',
    addPinTitle: 'Add yourself to the map',
    yourPinTitle: 'Your map pin',
    existingPinLabel:
      'The map pin you registered has the following description:',
  },
  workspace: {
    description:
      'In order to have your pin accepted on our map you have to collect at least 6 stars in the Ally Checklist. Learn more about the Community Program and how you can join.',
    title: 'Your map pin',
  },
}

export const notificationForm = {
  loading: 'Loading your notification setting',
  succesfulSave: 'Notification setting saved successfully - whoop',
}

export const mapForm = {
  confirmDeletePin:
    'If you delete your location now, adding a new map pin in the future might need approving.',
  descriptionMember:
    "Add yourself to the map with a 'want to get started' pin so people can find you, reach out and collaborate. Make sure to add some contact details to your profile!",
  descriptionSpace:
    "Map pins undergo moderator's approval which might take several days.",
  loading: 'Loading your map pin',
  locationLabel: 'Your current map pin is here:',
  needsChanges:
    'This map pin has been marked as requiring further changes. Specifically the moderator comments are:',
  noLocationLabel: 'No map pin currently saved',
  succesfulSave: 'Map pin saved successfully - whoop',
  sucessfulDelete: 'Location data removed',
}

export const missingData = 'Do you have impact data for this year?'
