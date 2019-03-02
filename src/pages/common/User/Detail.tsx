import * as React from 'react'
import { IUser } from 'src/models/user.models'
import { Label } from 'src/components/Form/Fields'
import AvatarPic from '@material-ui/core/Avatar'

interface IProps {
  user: IUser
}

export class UserDetail extends React.Component<IProps> {
  public render() {
    let user = this.props.user;
    return (
      <div>
        <AvatarPic
          alt="Remy Sharp"
          src="http://i.pravatar.cc/200"
          className="header__avatar"
        />
        <Label text="Display name" />
        <div>
          {user.display_name}
        </div>
        <Label text="Country" />
        <div>
          {user.country}
        </div>
        <Label text="Email" />
        <div>
          {user.email}
        </div>
      </div>
    )
  }
}