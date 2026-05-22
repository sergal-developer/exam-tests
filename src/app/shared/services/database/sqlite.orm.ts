import 'reflect-metadata';

// Llave única para almacenar los metadatos de la clase
const SQLITE_METADATA_KEY = Symbol('sqlite:column');

interface ColumnOptions {
  primaryKey?: boolean;
  autoIncrement?: boolean;
  notNull?: boolean;
  unique?: boolean;
  default?: any;
  customType?: 'TEXT' | 'INTEGER' | 'REAL' | 'BLOB'; // Por si quieres forzar un tipo de SQLite
  json?: boolean;
}

interface ColumnMetadata extends ColumnOptions {
  propertyKey: string;
  propertyType: string;
}

/**
 * Decorador de Propiedad: Marca una variable de la clase como columna de SQLite
 */
export function Column(options: ColumnOptions = {}): PropertyDecorator {
  return (target: Object, propertyKey: string | symbol) => {
    // Obtener el tipo de dato real de la propiedad usando Reflection incorporado de TS
    const type = Reflect.getMetadata('design:type', target, propertyKey);
    const propertyType = type ? type.name.toLowerCase() : 'text';

    // Obtener columnas ya registradas en la clase
    const existingColumns: ColumnMetadata[] = 
      Reflect.getMetadata(SQLITE_METADATA_KEY, target.constructor) || [];

    // Añadir la nueva columna
    existingColumns.push({
      propertyKey: propertyKey.toString(),
      propertyType,
      ...options
    });

    // Guardar los metadatos de vuelta en la clase
    Reflect.defineMetadata(SQLITE_METADATA_KEY, existingColumns, target.constructor);
  };
}

/**
 * Función Generadora: Recibe la Clase en la firma y escupe el Script SQL
 * @param targetClass La clase constructora (ej: Usuario)
 * @param tableName Nombre opcional para la tabla (si no se pasa, usa el nombre de la clase)
 */
export function generateTableFromClass(targetClass: Function, tableName?: string): string {
  const name = tableName || targetClass.name.toLowerCase() + 's';
  const columns: ColumnMetadata[] = Reflect.getMetadata(SQLITE_METADATA_KEY, targetClass) || [];

  if (columns.length === 0) {
    throw new Error(`La clase ${targetClass.name} no tiene ninguna columna decorada con @Column()`);
  }

  const columnsSQL = columns.map(col => {
    // 1. Mapear tipo de dato de TS/JS a tipo de dato de SQLite
    let sqliteType = 'TEXT';
    if (col.customType) {
      sqliteType = col.customType;
    } else if (col.propertyType === 'number') {
      // Si es un número decimal o entero, decidir tipo base
      sqliteType = Number.isInteger(col.default) || col.autoIncrement ? 'INTEGER' : 'REAL';
    } else if (col.propertyType === 'boolean') {
      sqliteType = 'INTEGER'; // SQLite guarda booleanos como 0 o 1
    }

    // 2. Construir restricciones
    let sqlDefinition = `${col.propertyKey} ${sqliteType}`;
    
    if (col.primaryKey) sqlDefinition += ' PRIMARY KEY';
    if (col.autoIncrement && sqliteType === 'INTEGER') sqlDefinition += ' AUTOINCREMENT';
    if (col.notNull) sqlDefinition += ' NOT NULL';
    if (col.unique) sqlDefinition += ' UNIQUE';
    if (col.default !== undefined) {
      const defaultVal = typeof col.default === 'string' ? `'${col.default}'` : col.default;
      sqlDefinition += ` DEFAULT ${defaultVal}`;
    }

    return sqlDefinition;
  });

  return `CREATE TABLE IF NOT EXISTS ${name} (\n  ${columnsSQL.join(',\n  ')}\n);`;
}