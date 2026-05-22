import { Column, generateTableFromClass } from "src/app/shared/services/database/sqlite.orm";
import { IThemeDTO } from "./theme.dto";
import { ILanguageDTO } from "./language.dto";

export class SettingsDTO {
    @Column({ primaryKey: true  })
    id!: number;

    @Column({ notNull: true })
    language!: string;

    @Column({ json: true })
    permissions!: string;
}

export const SettingsDTOScript = generateTableFromClass(SettingsDTO, 'settings_table');

export interface ISettingsDTO {
  id?: string;
  language: string;
  permissions: {
    create: boolean,
    duplicate: boolean,
    edit: boolean,
    delete: boolean,
    ai: boolean,
  }

  availableLanguages: ILanguageDTO[];
  premium: boolean,
  colors?: Array<any>;
  theme?: string;
  themeProps: {
    light: IThemeDTO,
    dark: IThemeDTO
  }
}
