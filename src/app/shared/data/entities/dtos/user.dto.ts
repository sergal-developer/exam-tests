export const user_table_script = 
`CREATE TABLE IF NOT EXISTS [user_table] (
  [userId] INTEGER PRIMARY KEY,
  [uuid] TEXT,
  [userName] TEXT NOT NULL,
  [age] INTEGER,
  [avatarUrl] TEXT,
  [avatarBody] TEXT,
  [current] BOOLEAN
);`;

export interface IUserDTO {
  userId?: string;
  uuid: string;
  userName: string;
  age?: number;
  avatarUrl?: string;
  avatarBody?: string;
  current: boolean;
}
