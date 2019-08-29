/*  functions used for migration between DaveHakkens.nl site and OneArmy
    in 'hacks' folder as not part of core platform and could later be moved out entirely
*/
import * as React from 'react'
import { functions } from 'src/utils/firebase'
import { IUser } from 'src/models/user.models'
import { Button } from 'src/components/Button'
import { UserStore } from 'src/stores/User/user.store'
import Text from 'src/components/Text'
import { TextNotification } from 'src/components/Notification/TextNotification'

interface IProps {
  mention_name: string
  userStore: UserStore
}
interface IState {
  isImporting: boolean
  errMsg?: string
  showImportSuccess?: boolean
}

export class DHImport extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = { isImporting: false }
  }

  // import a user given by mention name, copying avatar to server and updating specified DB fields
  public async importProfileFromDH() {
    const name = this.props.mention_name
    console.log('importing mention name', name)
    if (name) {
      this.setState({ isImporting: true, errMsg: undefined })
      const member = (await this.importBPMember(name)) as IBPMember
      if (member) {
        await this.props.userStore.setUserAvatarFromUrl(member.avatar_urls.full)
        const profile: Partial<IUser> = {
          DHSite_id: member.id,
          DHSite_mention_name: member.mention_name,
          country: member.xprofile.groups[1].fields[42].value,
          // strip \ characters populated by BP
          about: member.xprofile.groups[1].fields[667].value.replace(/\\/g, ''),
        }
        await this.props.userStore.updateUserProfile(profile)
        // show notification. Hide again in case planning to make further changes
        this.setState({ showImportSuccess: true })
        setTimeout(() => {
          this.setState({ showImportSuccess: false })
        }, 2000)
      }
    }
  }

  // get DH site member data from @mention_name and merge subset into correct user format
  public importBPMember = async (name: string) => {
    try {
      const result = await functions.httpsCallable('DHSite_getUser')(name)
      const member = result.data as IBPMember
      return member
    } catch (error) {
      this.setState({ errMsg: `Error: ${error.message}`, isImporting: false })
      return null
    }
  }

  public render() {
    const disabled = !this.props.mention_name || this.state.isImporting
    return (
      <>
        <Button
          small
          disabled={disabled}
          onClick={() => this.importProfileFromDH()}
          variant={disabled ? 'tertiary' : 'tertiary'}
          ml={2}
          mb={2}
          height={'40px'}
        >
          Import
        </Button>
        <Text color="error">{this.state.errMsg}</Text>
        <TextNotification
          show={this.state.showImportSuccess}
          text="Profile imported!"
          icon="check"
        />
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
      },
    ]
    collection: [
      {
        href: string
      },
    ]
  }
}
