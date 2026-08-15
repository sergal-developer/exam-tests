import { LanguageDTO } from "./language.dto"
import { ThemeDTO } from "./theme.dto";

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

export const settings_table_querys = {

  createTable: {
    query: `
      CREATE TABLE IF NOT EXISTS [settings_table] (
        [settingId] INTEGER PRIMARY KEY,
        [language] TEXT NOT NULL,
        [permissions] TEXT,
        [theme] TEXT
      );
    `
  },

  deleteTable: {
    query: `
      DROP TABLE IF EXISTS [settings_table];
    `
  },

  selectAll: {
    query: `
      SELECT *
      FROM [settings_table];
    `
  },

  selectById: {
    query: `
      SELECT *
      FROM [settings_table]
      WHERE [settingId] = ?;
    `
  },

  selectByIdWithRelations: {
    query:
      `SELECT 
                q.settingId,
                q.language,
                q.permissions,
                q.theme,
                (
                    SELECT json_group_array(
                        json_object(
                            'value', l.value,
                            'name', l.name
                        )
                    ) FROM [language_table] l
                ) as _languages,
                (
                    SELECT json_group_array(
                        json_object(
                            'id', t.id,
                            'content', t.content
                        )
                    ) FROM [theme_table] t
                ) as _themes
            FROM [settings_table] q 
            WHERE q.settingId = ?;`
  },


  filterBy: {
    query: `
      SELECT *
      FROM [settings_table]
      WHERE [language] = :language;
    `
  },

  post: {
    query: `
      INSERT INTO [settings_table] (
        [settingId],
        [language],
        [permissions],
        [theme]
      )
      VALUES (?, ?, ? ,?)
      ON CONFLICT(settingId) DO UPDATE SET 
            language = excluded.language, 
            permissions = excluded.permissions, 
            theme = excluded.theme
      RETURNING *;
    `
  },

  put: {
    query: `
      INSERT INTO [settings_table] (
        [settingId],
        [language],
        [permissions],
        [theme]
      )
      VALUES (?, ?, ? ,?)
      ON CONFLICT(settingId) DO UPDATE SET 
            language = excluded.language, 
            permissions = excluded.permissions, 
            theme = excluded.theme
      RETURNING *;
    `
  },

  deleteById: {
    query: `
      DELETE FROM [settings_table]
      WHERE [settingId] = ?;
    `
  }

};
