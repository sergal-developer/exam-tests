export const language_table_script = 
`CREATE TABLE IF NOT EXISTS [language_table] (
  [value] TEXT PRIMARY KEY,
  [name] TEXT
);`;

export interface LanguageDTO {
  value: string;
  name: string;
}