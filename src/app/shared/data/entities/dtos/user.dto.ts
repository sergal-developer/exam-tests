
export interface UserDTO {
  userId?: number;
  uuid: string;
  userName: string;
  age?: number;
  avatarUrl?: string;
  avatarBody?: string;
  current: boolean | number;

  // GENERATED
}

export const user_querys = {
  createTable: {
    query:
      `CREATE TABLE IF NOT EXISTS [user_table] (
      [userId] INTEGER PRIMARY KEY,
      [uuid] TEXT,
      [userName] TEXT NOT NULL,
      [age] INTEGER,
      [avatarUrl] TEXT,
      [avatarBody] TEXT,
      [current] BOOLEAN
    );`
  },

  deleteTable: {
    query:
      `DELETE FROM user_table`

  },

  select: {
    query:
      `SELECT * FROM user_table;`

  },

  selectById: {
    query:
      `SELECT * FROM user_table WHERE userId = ?;`

  },

  selectByCurrent: {
    query:
      `SELECT * FROM user_table WHERE current = 1 LIMIT 1;`

  },

  post: {
    query:
      `INSERT INTO user_table (uuid, userName, age, avatarUrl, avatarBody, current) 
        VALUES (?, ?, ?, ?, ?, ?)
        RETURNING *;`
  },

  put: {
    query:
      `INSERT INTO user_table (userId, uuid, userName, age, avatarUrl, avatarBody, current) 
        VALUES (?, ?, ?, ?, ?, ?, ?) 
        ON CONFLICT(userId) DO UPDATE SET 
            uuid = excluded.uuid,
            userName = excluded.userName, 
            age = excluded.age, 
            avatarUrl = excluded.avatarUrl, 
            avatarBody = excluded.avatarBody, 
            current = excluded.current
        RETURNING *;`
  },

  deleteById: {
    query:
      `DELETE FROM user_table WHERE userId = ?;`

  }
}
