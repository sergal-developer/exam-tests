export const log_table_script = 
`CREATE TABLE IF NOT EXISTS [log_table] (
  [id] INTEGER PRIMARY KEY AUTOINCREMENT,
  [date] INTEGER,
  [content] TEXT,
  [type] TEXT
);`;

export interface ILogDTO {
  id?: string;
  date?: number,
  content: any,
  type?: string
}
