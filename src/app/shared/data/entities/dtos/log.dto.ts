import { Column, generateTableFromClass } from "src/app/shared/services/database/sqlite.orm";

export class LogDTO {
    @Column({ primaryKey: true, autoIncrement: true })
    id!: number;

    @Column({ notNull: true })
    date!: number;

    @Column({ notNull: true })
    content!: string;

    @Column({ notNull: true })
    type!: string;
}

export const LogDTOScript = generateTableFromClass(LogDTO, 'log_table');

export interface ILogDTO {
  id?: string;
  date?: number,
  content: any,
  type?: string
}
