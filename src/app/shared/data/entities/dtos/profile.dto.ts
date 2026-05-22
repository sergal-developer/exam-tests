import { Column, generateTableFromClass } from "src/app/shared/services/database/sqlite.orm";

export class ProfileDTO {
    @Column({ primaryKey: true, autoIncrement: true })
    id!: number;

    @Column({ notNull: true })
    userName!: string;

    @Column()
    age!: number;

    @Column()
    current!: boolean;

    @Column()
    avatarUrl!: string;

    @Column()
    avatarBody!: string;
}

export const ProfileDTOScript = generateTableFromClass(ProfileDTO, 'profile_table');

export interface IProfileDTO {
  id?: string;
  userName: string;
  age?: number;
  avatarUrl?: string;
  avatarBody?: string;
  current: boolean,
}
