import { Column, generateTableFromClass } from "src/app/shared/services/database/sqlite.orm";

export class LanguageDTO {
    @Column({ primaryKey: true })
    value!: number;

    @Column({ notNull: true })
    name!: string;
}

export const LanguageDTOScript = generateTableFromClass(LanguageDTO, 'language_table');

export interface ILanguageDTO {
  value: string;
  name: string;
}
