import type { StoryFn, Meta } from '@storybook/react'
import { ProfileLink } from './ProfileLink'

export default {
  title: 'Components/ProfileLink',
  component: ProfileLink,
} as Meta<typeof ProfileLink>

export const Instagram: StoryFn<typeof ProfileLink> = () => (
  <ProfileLink
    url="https://instagram.com"
    label="social media"
    icon="social-media"
  />
)

export const Facebook: StoryFn<typeof ProfileLink> = () => (
  <ProfileLink
    url="https://facebook.com"
    label="social media"
    icon="social-media"
  />
)

export const Youtube: StoryFn<typeof ProfileLink> = () => (
  <ProfileLink
    url="https://youtube.com"
    label="social media"
    icon="social-media"
  />
)

export const Twitter: StoryFn<typeof ProfileLink> = () => (
  <ProfileLink
    url="https://twitter.com"
    label="social media"
    icon="social-media"
  />
)

export const Email: StoryFn<typeof ProfileLink> = () => (
  <ProfileLink url="info@preciousplastic.com" label="email" icon="email" />
)

export const Bazaar: StoryFn<typeof ProfileLink> = () => (
  <ProfileLink
    url="https://bazar.preciousplastic.com/abc"
    label="bazar"
    icon="bazar"
  />
)

export const Website: StoryFn<typeof ProfileLink> = () => (
  <ProfileLink url="https://example.com" label="website" icon="website" />
)
