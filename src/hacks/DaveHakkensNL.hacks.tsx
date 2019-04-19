/*  functions used for migration between DaveHakkens.nl site and OneArmy
    in 'hacks' folder as not part of core platform and could later be moved out entirely
*/
import * as React from 'react'
import { functions } from 'src/utils/firebase'
import { IUser } from 'src/models/user.models'
import { Button } from 'src/components/Button'
import { UserStore } from 'src/stores/User/user.store'
import { Typography } from '@material-ui/core'

interface IProps {
  mention_name: string
  userStore: UserStore
}
interface IState {
  isImporting: boolean
  errMsg?: string
}

export class DHImport extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = { isImporting: false }
  }

  public async importProfileFromDH() {
    const name = this.props.mention_name
    console.log('importing mention name', name)
    if (name) {
      this.setState({ isImporting: true })
      const profile = await this.importBPMember(name)
      await this.props.userStore.updateUserProfile(profile)
      this.setState({ isImporting: false })
    }
  }

  // get DH site member data from @mention_name and merge subset into correct user format
  public importBPMember = async (name: string) => {
    try {
      const result = await functions.httpsCallable('DHSite_getUser')(name)
      const member = result.data as IBPMember
      const profile: Partial<IUser> = {
        avatar: member.avatar_urls.full,
        avatar_thumb: member.avatar_urls.thumb,
        legacy_id: member.id,
        mention_name: member.mention_name,
        country: member.xprofile.groups[1].fields[42].value,
        // strip \ characters populated by BP
        about: member.xprofile.groups[1].fields[667].value.replace(/\\/g, ''),
      }
      console.log('profile', profile)
      return profile
    } catch (error) {
      this.setState({ errMsg: 'User not found' })
      return {}
    }
  }

  public render() {
    const user = ''
    return (
      <>
        <Button
          disabled={!this.props.mention_name || this.state.isImporting}
          onClick={() => this.importProfileFromDH()}
        >
          Import @{this.props.mention_name} from Dave Hakkens
        </Button>
        <Typography color="error" variant="caption">
          {this.state.errMsg}
        </Typography>
      </>
    )
  }
}

// BP (buddypress) members are imported from the Dave Hakkens site and used for migration
export interface IBPMember {
  id: number
  name: string
  email: string
  user_login: string
  link: string
  member_types: []
  xprofile: {
    groups: {
      '1': {
        name: 'Base'
        fields: {
          '1': {
            name: 'Name'
            value: string
          }
          '8': {
            name: 'Birthday'
            value: string
          }
          '38': {
            name: 'Website'
            value: string
          }
          '42': {
            name: 'Location'
            value: string
          }
          '667': {
            name: 'About'
            value: string
          }
          '1055': {
            name: 'Your love'
            value: [string[]]
          }
        }
      }
      '2': {
        name: 'Additional information'
        fields: {
          '1264': {
            name: 'Country'
            value: string
          }
        }
      }
    }
  }
  mention_name: 'fernandochacon'
  avatar_urls: {
    full: string
    thumb: string
  }
  _links: {
    self: [
      {
        href: string
      }
    ]
    collection: [
      {
        href: string
      }
    ]
  }
}
