export interface ProfileEntity {
    userId?: string;
    userName: string;
    age?: number;
    avatar?: {
        url: string,
        body?: string,
    }
    current: boolean,
}

export interface SettingsEntity {
    language: string;
    permissions: {
        create: boolean,
        duplicate: boolean,
        edit: boolean,
        delete: boolean,
    }
    colors: Array<any>;
    theme?: string;
}
