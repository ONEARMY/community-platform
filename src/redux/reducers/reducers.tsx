import { combineReducers } from "redux";
import { UserReducer } from "./user.reducer";

export default combineReducers({ user: UserReducer });
