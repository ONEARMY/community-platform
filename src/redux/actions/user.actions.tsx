import { IUser } from "../../models/models";
import { FluxStandardAction } from "flux-standard-action";
import { IUserState } from "../../models/user.models";

export type UserAction = FluxStandardAction<IUser, null>;

export class UserActionTypes {
  public static readonly UPDATE_USER = "[user] UPDATE_USER";
  public static readonly LOGIN_USER_SUCCESS = "[user] LOGIN_SUCESS";
  public static readonly LOGIN_USER_FAIL = "[user] LOGIN_FAIL";
}

export const updateUser = (user: IUser | null) => ({
  type: UserActionTypes.UPDATE_USER,
  meta: null,
  payload: user
});
