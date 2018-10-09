import { IProject } from "./models";

export interface IUserState {
  loggedIn: boolean;
  user?: IUser;
}
export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  projects?: IProject;
  verified: boolean;
  altName?: string;
  address?: IAddress;
}

interface IAddress {
  country: string;
  postcode: string;
  street: string;
  flatNumber?: number;
}
