import { Link } from 'rebass'

import ElWithBeforeIcon from 'src/components/ElWithBeforeIcon'

import { capitalizeFirstLetter } from 'src/utils/helpers'
import IconEmail from 'src/assets/icons/icon-email.svg'
import IconDiscord from 'src/assets/icons/icon-discord.svg'
import IconBazar from 'src/assets/icons/icon-bazar.svg'
import IconSocial from 'src/assets/icons/icon-social-media.svg'
import IconForum from 'src/assets/icons/icon-forum.svg'
import IconWebsite from 'src/assets/icons/icon-website.svg'
import { IUser } from 'src/models/user.models'

interface IProps {
  link: IUser['links'][0]
}

/**
 * Ensure urls are complete (start http/https://) and replace emails with mailto
 */
const rewriteUrl = (link: IProps['link']) => {
  switch (link.label) {
    case 'email':
      return `mailto:${link.url}`
    default:
      return link.url.indexOf('http') === 0 ? link.url : `http://${link.url}`
  }
}

const ProfileLinkIcon = (link: IProps['link']) => {
  const { label } = link
  const icons: { [key in IProps['link']['label']]: JSX.Element | string } = {
    forum: IconForum,
    website: IconWebsite,
    email: IconEmail,
    'social media': IconSocial,
    bazar: IconBazar,
    discord: IconDiscord,
    facebook: IconSocial,
    instagram: IconSocial,
  }
  // some legacy profiles formatted differently, to remove once db made consistent
  icons['social-media'] = IconSocial
  return icons[label]
}

const ProfileLink = (props: IProps) => {
  const { link } = props
  return (
    <ElWithBeforeIcon IconUrl={ProfileLinkIcon(link)}>
      <Link ml={2} color={'black'} href={rewriteUrl(link)} target="_blank">
        {link.label && capitalizeFirstLetter(link.label)}
      </Link>
    </ElWithBeforeIcon>
  )
}
export default ProfileLink
