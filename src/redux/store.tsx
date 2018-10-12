import { createStore, applyMiddleware } from "redux";
import rootReducer from "./reducers/reducers";
import { IUserState } from "../models/user.models";
import { composeWithDevTools } from "redux-devtools-extension";

const InitialState: IStoreState = {};
export const store = createStore<IStoreState, any, any, any>(
  rootReducer,
  InitialState,
  composeWithDevTools()
  // other store enhancers if any
);

export interface IStoreState {
  user?: IUserState;
}
