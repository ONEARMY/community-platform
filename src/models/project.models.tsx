import { IUser } from "./models";

export interface IProject {
  id: string;
  name: string;
  createdBy: string;
  users: IUser[];
}
