export interface LanguageDTO {
  value: string;
  name: string;
}

export const language_querys = {
  createTable: {
    query:
      `CREATE TABLE IF NOT EXISTS [language_table] (
      [value] TEXT PRIMARY KEY,
      [name] TEXT
    );`
  },
  
  deleteTable: {
    query:
      `DELETE FROM language_table;`
  },

  select: {
    query:
      `SELECT * FROM language_table;`

  },

  selectById: {
    query:
      `SELECT * FROM language_table WHERE value = ?;`
  },

  post: {
    query:
      `INSERT INTO language_table (value, name) 
        VALUES (?, ?) 
        ON CONFLICT(value) DO UPDATE SET name = excluded.name
        RETURNING *;`
  },

  deleteById: {
    query:
      `DELETE FROM language_table WHERE value = ?;`
  }
}
