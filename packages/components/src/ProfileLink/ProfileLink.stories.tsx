import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { ProfileLink } from './ProfileLink'

export default {
  title: 'Components/ProfileLink',
  component: ProfileLink,
} as ComponentMeta<typeof ProfileLink>

export const Instagram: ComponentStory<typeof ProfileLink> = () => (
  <ProfileLink
    url="https://instagram.com"
    label="social media"
    icon="social-media"
  />
)

export const Facebook: ComponentStory<typeof ProfileLink> = () => (
  <ProfileLink
    url="https://facebook.com"
    label="social media"
    icon="social-media"
  />
)

export const Youtube: ComponentStory<typeof ProfileLink> = () => (
  <ProfileLink
    url="https://youtube.com"
    label="social media"
    icon="social-media"
  />
)

export const Twitter: ComponentStory<typeof ProfileLink> = () => (
  <ProfileLink
    url="https://twitter.com"
    label="social media"
    icon="social-media"
  />
)

export const Email: ComponentStory<typeof ProfileLink> = () => (
  <ProfileLink url="info@preciousplastic.com" label="email" icon="email" />
)

export const Bazaar: ComponentStory<typeof ProfileLink> = () => (
  <ProfileLink
    url="https://bazar.preciousplastic.com/abc"
    label="bazar"
    icon="bazar"
  />
)

export const Website: ComponentStory<typeof ProfileLink> = () => (
  <ProfileLink url="https://example.com" label="website" icon="website" />
)
