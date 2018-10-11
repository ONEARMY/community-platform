import { UserActionTypes, UserAction } from "../actions/user.actions";
import { Action } from "redux";
import { IUserState } from "../../models/user.models";

const initialState: IUserState = {};

export const UserReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case UserActionTypes.UPDATE_USER: {
      const updateAction = action as UserAction;
      console.log("payload", updateAction.payload);
      if (!updateAction.payload) {
        return initialState;
      } else {
        return {
          ...state,
          ...updateAction.payload
        };
      }
    }

    default:
      return state;
  }
};
