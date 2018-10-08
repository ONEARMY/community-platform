import * as actions from "../actions/user.actions";
import { Action } from "redux";
import { IUserState } from "../../models/user.models";

const initialState: IUserState = {
  loggedIn: false
};

export const UserReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case actions.updateUser: {
      const updateAction = action as actions.UserAction;
      return {
        ...state,
        user: updateAction.payload
      };
    }

    default:
      return state;
  }
};
