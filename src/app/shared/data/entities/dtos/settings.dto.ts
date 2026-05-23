import { ILanguageDTO } from "./language.dto";
import { IThemeDTO } from "./theme.dto";

export const settings_table_script = 
`CREATE TABLE IF NOT EXISTS [settings_table] (
  [settingId] INTEGER PRIMARY KEY,
  [language] TEXT NOT NULL,
  [permissions] TEXT,
  [theme] TEXT
);`;

export interface ISettingsDTO {
  settingId?: string;
  language: string;
  permissions: {
    create: boolean,
    duplicate: boolean,
    edit: boolean,
    delete: boolean,
    ai: boolean,
  },
  theme?: string;

  // GENERATED
  _languages?: ILanguageDTO[],
  _themes?: IThemeDTO[],
  _colors?: Array<any>
}
