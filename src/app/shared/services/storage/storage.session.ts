export class StorageWeb {
  CONTEXT: string = '';
  constructor(context?: string) {
    this._configStorage(context);
  }

  //#region PRIVATE FUNCTIONS
  private _configStorage(context?: string) {
    this.CONTEXT = context || 'session-fleet';
  }
  private _get() {
    const data = localStorage.getItem(this.CONTEXT);
    return data ? JSON.parse(data) : null;
  }
  private _save(data: any, context?: string) {
    context = context || this.CONTEXT;
    localStorage.setItem(context, JSON.stringify(data));
  }
  clear(context?: string) {
    context = context || this.CONTEXT;
    localStorage.removeItem(context);
  }
  clearAll() {
    localStorage.clear();
  }
  //#endregion PRIVATE FUNCTIONS

  //#region CRUD
  getStorage(context?: string) {
    this._configStorage(context);
    return this._get();
  }

  saveStorage(data: any, context?: string, attribute?: string) {
    let db = this.getStorage(context);
    try {
      if (attribute) {
        db[attribute] = data;
      } else {
        db = data;
      }
      this._save(db, context);
      return this.getStorage(context);
    } catch (error) {
      console.warn("ERROR saveStorage: ", error);
      return null;
    }
  }

  searchTable(data: any, table: string, container: string, keySearch = 'id') {
    let storage = this.getStorage(table);
    const id = data[keySearch];
    if (!id) {
      return null;
    }
    try {
      storage[container] = storage[container] || [];
      return storage[container].filter((x: any) => { return x[keySearch] === id })[0];
    }
    catch (err) {
      return null;
    }
  }

  createTable(data: any, table: string) {
    let storage = this.getStorage(table);
    const keys = Object.keys(data);
    try {
      keys.forEach(key => {
        storage[key] = data[key];
      });
      storage = this.saveStorage(storage, table);
      return storage;
    }
    catch (err) {
      return null;
    }
  }

  updateTable(data: any, table: string, container: string) {
    let storage = this.getStorage(table);
    const keys = Object.keys(data);
    try {
      storage[container] = storage[container] || {};
      keys.forEach(key => {
        storage[container][key] = data[key];
      });
      storage = this.saveStorage(storage, table);
      return storage;
    }
    catch (err) {
      return null;
    }
  }

  searchUpdateTable(data: any, table: string, container: string, keySearch = 'id') {
    let storage = this.getStorage(table);
    const keys = Object.keys(data);
    const id = data[keySearch];
    if (!id) {
      return null;
    }

    try {
      storage[container] = storage[container] || {};
      const filtered = storage[container].filter((x: any) => { return x[keySearch] === id });
      if (!filtered.length) { return null }
      keys.forEach(key => {
        filtered[0][key] = data[key];
      });
      storage = this.saveStorage(storage, table);
      return storage;
    }
    catch (err) {
      return null;
    }
  }

  deleteTable(table: string) {
    let db = this.getStorage(table);
    try {
      this.clear(table);
      return !this.getStorage(table);
    } catch (error) {
      console.warn("ERROR delete storage: ", error);
      return null;
    }
  }
  //#endregion CRUD
}