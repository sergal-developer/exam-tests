export interface ProfileEntity {
    userId?: string;
    userName: string;
    age: number;
    character?: {
        avatar: string,
        body: string,
    }
    current: boolean
}
