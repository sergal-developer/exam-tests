export interface ProfileEntity {
    userId?: string;
    userName: string;
    age?: number;
    avatar?: {
        url: string,
        body?: string,
    }
    current: boolean
}
