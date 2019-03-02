import * as React from 'react'
import { IUser } from 'src/models/user.models'
import { Label } from 'src/components/Form/Fields'
import AvatarPic from '@material-ui/core/Avatar'
import { FlexContainer } from 'src/components/Layout/FlexContainer'
import { space } from 'src/themes/styled.theme'
import styled from 'styled-components'

const FlexDetail = styled(FlexContainer)`
  padding: ${space[0]};
  justify-content: space-between;
  alignItems: center;
`

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
        <FlexDetail>
          <Label text="Display name" />
          <p>{user.display_name}</p>
        </FlexDetail>
        <FlexDetail>
          <Label text="Country" />
          <p>{user.country}</p>
        </FlexDetail>
        <FlexDetail>
          <Label text="Email" />
          <p>{user.email}</p>
        </FlexDetail>
      </div>
    )
  }
}
