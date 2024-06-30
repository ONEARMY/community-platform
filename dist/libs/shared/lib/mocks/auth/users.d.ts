import { UserRole } from '../../models';

export interface IMockAuthUser {
    uid: string;
    label: string;
    email?: string;
    password?: string;
    roles: UserRole[];
}
type IMockUsers = {
    [key in UserRole]: IMockAuthUser;
};
/** A list of specific demo/mock users that are prepopulated onto testing sites for use in development */
export declare const MOCK_AUTH_USERS: IMockUsers;
export {};
