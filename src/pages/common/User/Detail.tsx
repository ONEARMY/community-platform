import * as React from 'react'
import { IUser } from 'src/models/user.models'
import { Label } from 'src/components/Form/Fields'
import AvatarPic from '@material-ui/core/Avatar'
import { FlexContainer } from 'src/components/Layout/FlexContainer'

interface IProps {
  user: IUser
}

export class UserDetail extends React.Component<IProps> {
  public render() {
    let user = this.props.user
    return (
      <div>
        <AvatarPic
          alt="Remy Sharp"
          src="http://i.pravatar.cc/200"
          className="header__avatar"
        />
        <FlexContainer
          p={0}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Label text="Display name" />
          <p>{user.display_name}</p>
        </FlexContainer>
        <FlexContainer
          p={0}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Label text="Country" />
          <p>{user.country}</p>
        </FlexContainer>
        <FlexContainer
          p={0}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Label text="Email" />
          <p>{user.email}</p>
        </FlexContainer>
      </div>
    )
  }
}
