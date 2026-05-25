import { LanguageDTO } from "./language.dto"
import { ThemeDTO } from "./theme.dto";

export const settings_table_script = 
`CREATE TABLE IF NOT EXISTS [settings_table] (
  [settingId] INTEGER PRIMARY KEY,
  [language] TEXT NOT NULL,
  [permissions] TEXT,
  [theme] TEXT
);`;

export interface SettingsDTO {
  settingId?: number;
  language: string;
  theme?: string;
  permissions: string | PermissionsDTO,

  // GENERATED
  _languages?: LanguageDTO[],
  _themes?: ThemeDTO[],
  _colors?: Array<any>
}

export interface PermissionsDTO {
    create: boolean,
    duplicate: boolean,
    edit: boolean,
    delete: boolean,
    ai: boolean,
}
