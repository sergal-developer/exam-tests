export class LocalStorage {
  context: string = 'context';

  constructor(context: string) {
    this.context = context;
  }

  getData(context?: string) {
    const ctx = context ?? this.context;
    return JSON.parse(<any>localStorage.getItem(ctx));
  }

  saveInArray(data: any, primaryKey: string, context?: string) {
    const ctx = context ?? this.context;
    let storage = this.getData(ctx);
    if (!storage) {
      storage = [];
    }

    if (data[primaryKey] != null && storage.length) {
      let index = storage.findIndex(
        (a: any) => a[primaryKey] === data[primaryKey]
      );
      console.log('index: ', index);
      if (index >= 0) {
        storage[index] = data;
      } else {
        storage.push(data);
      }
    } else {
      storage.push(data);
    }

    localStorage.setItem(ctx, JSON.stringify(storage));
    return this.getData(ctx);
  }

  saveInObject(data: string, context?: string) {
    const ctx = context ?? this.context;
    let storage = this.getData(ctx);
    if (!storage) {
      storage = {};
    }

    storage = data;

    localStorage.setItem(ctx, JSON.stringify(storage));
    return this.getData(ctx);
  }

  delete(context?: string) {
    const ctx = context ?? this.context;
    localStorage.removeItem(ctx);
    return !this.getData(ctx);
  }
}
