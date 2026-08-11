export interface LogDTO {
  id?: number;
  date?: number,
  content: any,
  type: string
}

export const log_querys = {
  createTable: {
    query:
      `CREATE TABLE IF NOT EXISTS [log_table] (
            [id] INTEGER PRIMARY KEY AUTOINCREMENT,
            [date] INTEGER,
            [content] TEXT,
            [type] TEXT );`
  },
  
  deleteTable: {
    query:
      `DELETE FROM log_table;`
  },

  select: {
    query:
      `SELECT * FROM log_table;`

  },

  selectById: {
    query:
      `SELECT * FROM log_table WHERE id = ?;`

  },

  post: {
    query:
      `INSERT INTO log_table (id, date, content, type) 
        VALUES (?, ?, ?, ?) 
        ON CONFLICT(id) DO UPDATE SET 
            date = excluded.date, 
            content = excluded.content, 
            type = excluded.type
        RETURNING *;`},

  deleteById: {
    query:
      `DELETE FROM log_table WHERE id = ?;`

  }
}
