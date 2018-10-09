import { IUser } from "../../models/models";
import { FluxStandardAction } from "flux-standard-action";
import { IUserState } from "../../models/user.models";

export type UserAction = FluxStandardAction<any, null>;

export class UserActions {
  public static readonly UPDATE_USER = "[user] UPDATE_USER";
  public static readonly LOGIN_USER_SUCCESS = "[user] LOGIN_SUCESS";
  public static readonly LOGIN_USER_FAIL = "[user] LOGIN_FAIL";
}

export function updateUser(user: IUser) {
  return (dispatch: any, getState: IUserState) => {
    dispatch({
      type: UserActions.UPDATE_USER,
      meta: null,
      payload: user
    });
    // return TodoApi.createTodo(todo).then(res => {
    //   dispatch(CreateTodoSuccess(res.data.data));
    // });
  };
}
