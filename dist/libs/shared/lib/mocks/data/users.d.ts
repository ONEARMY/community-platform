import { UserRole } from '../../models';

/**
 * If you want to be able to log with any of the users below
 * you will need to manually create them within
 * the `onearmy-test-ci` Firebase Project.
 * https://console.firebase.google.com/u/0/project/onearmy-test-ci/authentication/users
 */
export declare const users: {
    subscriber: {
        _authID: string;
        _id: string;
        _created: string;
        _modified: string;
        displayName: string;
        userName: string;
        userRoles: never[];
        coverImages: {
            contentType: string;
            fullPath: string;
            name: string;
            size: number;
            type: string;
        }[];
        links: {
            label: string;
            url: string;
        }[];
        about: string;
        email: string;
        password: string;
    };
    'beta-tester': {
        _authID: string;
        _id: string;
        _created: string;
        _modified: string;
        displayName: string;
        userName: string;
        userRoles: UserRole[];
        links: never[];
        email: string;
        password: string;
        notification_settings: {
            emailFrequency: string;
        };
        unsubscribeToken: string;
    };
    admin: {
        _authID: string;
        _id: string;
        _created: string;
        _modified: string;
        displayName: string;
        userName: string;
        userRoles: UserRole[];
        links: never[];
        email: string;
        password: string;
    };
    notification_howto_author: {
        verified: boolean;
        _modified: string;
        _authID: string;
        _created: string;
        displayName: string;
        _id: string;
        _deleted: boolean;
        userName: string;
        moderation: string;
        notifications: never[];
    };
    notification_triggerer: {
        verified: boolean;
        _modified: string;
        _authID: string;
        _created: string;
        displayName: string;
        _id: string;
        _deleted: boolean;
        userName: string;
        moderation: string;
        notifications: never[];
    };
    event_creator: {
        verified: boolean;
        _modified: string;
        _authID: string;
        _created: string;
        displayName: string;
        _id: string;
        _deleted: boolean;
        userName: string;
        moderation: string;
    };
    event_editor: {
        _deleted: boolean;
        userName: string;
        verified: boolean;
        _modified: string;
        _authID: string;
        displayName: string;
        _created: string;
        _id: string;
    };
    event_reader: {
        _id: string;
        _deleted: boolean;
        userName: string;
        moderation: string;
        verified: boolean;
        _modified: string;
        _authID: string;
        _created: string;
        displayName: string;
        userRoles: UserRole[];
    };
    howto_creator: {
        _deleted: boolean;
        userName: string;
        moderation: string;
        verified: boolean;
        _modified: string;
        _authID: string;
        _created: string;
        displayName: string;
        _id: string;
    };
    howto_editor: {
        _id: string;
        _deleted: boolean;
        userName: string;
        moderation: string;
        verified: boolean;
        _modified: string;
        _authID: string;
        displayName: string;
        _created: string;
    };
    howto_reader: {
        verified: boolean;
        _modified: string;
        _authID: string;
        _created: string;
        displayName: string;
        _id: string;
        _deleted: boolean;
        userName: string;
        moderation: string;
    };
    research_creator: {
        _deleted: boolean;
        userName: string;
        moderation: string;
        verified: boolean;
        _modified: string;
        _authID: string;
        _created: string;
        displayName: string;
        _id: string;
        userRoles: UserRole[];
    };
    research_editor: {
        _id: string;
        _deleted: boolean;
        userName: string;
        moderation: string;
        verified: boolean;
        _modified: string;
        _authID: string;
        displayName: string;
        _created: string;
        userRoles: UserRole[];
    };
    research_reader: {
        verified: boolean;
        _modified: string;
        _authID: string;
        _created: string;
        displayName: string;
        _id: string;
        _deleted: boolean;
        userName: string;
        moderation: string;
        userRoles: never[];
    };
    settings_community_new: {
        _id: string;
        profileType: null;
        coverImages: never[];
        isExpert: null;
        collectedPlasticTypes: null;
        openingHours: never[];
        location: null;
        verified: boolean;
        _modified: string;
        _created: string;
        displayName: string;
        isV4Member: null;
        _deleted: boolean;
        workspaceType: null;
        country: null;
        userName: string;
        links: never[];
        mapPinDescription: null;
        machineBuilderXp: null;
        _authID: string;
        about: null;
    };
    settings_machine_new: {
        collectedPlasticTypes: null;
        location: null;
        openingHours: never[];
        verified: boolean;
        _modified: string;
        _created: string;
        displayName: string;
        isV4Member: null;
        _deleted: boolean;
        workspaceType: null;
        country: null;
        userName: string;
        links: never[];
        mapPinDescription: null;
        machineBuilderXp: never[];
        _authID: string;
        about: null;
        _id: string;
        profileType: null;
        coverImages: never[];
        isExpert: null;
    };
    settings_member_new: {
        isV4Member: null;
        _deleted: boolean;
        workspaceType: null;
        country: string;
        userName: string;
        links: never[];
        mapPinDescription: null;
        machineBuilderXp: null;
        _authID: string;
        about: null;
        _id: string;
        profileType: null;
        coverImages: never[];
        isExpert: null;
        collectedPlasticTypes: null;
        openingHours: never[];
        location: null;
        verified: boolean;
        _modified: string;
        _created: string;
        displayName: string;
    };
    settings_plastic_new: {
        collectedPlasticTypes: never[];
        openingHours: never[];
        location: null;
        verified: boolean;
        _modified: string;
        _created: string;
        displayName: string;
        isV4Member: null;
        _deleted: boolean;
        workspaceType: null;
        country: null;
        userName: string;
        links: never[];
        mapPinDescription: null;
        machineBuilderXp: null;
        _authID: string;
        about: null;
        _id: string;
        profileType: null;
        coverImages: never[];
        isExpert: null;
    };
    settings_workplace_new: {
        openingHours: never[];
        location: null;
        verified: boolean;
        _modified: string;
        _created: string;
        displayName: string;
        isV4Member: null;
        _deleted: boolean;
        workspaceType: null;
        country: null;
        userName: string;
        links: never[];
        mapPinDescription: null;
        machineBuilderXp: null;
        _authID: string;
        about: null;
        _id: string;
        profileType: string;
        coverImages: never[];
        isExpert: null;
        collectedPlasticTypes: null;
        email: string;
        password: string;
        userRoles: UserRole[];
        impact: {
            2022: {
                id: string;
                value: number;
                isVisible: boolean;
            }[];
        };
        isContactableByPublic: boolean;
    };
    mapview_testing_rejected: {
        openingHours: never[];
        location: null;
        verified: boolean;
        _modified: string;
        _created: string;
        displayName: string;
        isV4Member: null;
        _deleted: boolean;
        workspaceType: null;
        country: null;
        userName: string;
        links: never[];
        mapPinDescription: null;
        machineBuilderXp: null;
        _authID: string;
        about: null;
        _id: string;
        profileType: string;
        coverImages: never[];
        isExpert: null;
        collectedPlasticTypes: null;
        email: string;
        password: string;
    };
};
