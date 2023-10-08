export class Storage {
    CONTEXT: string = "exam";
    constructor(context?: string) {
      if (context) {
        this.CONTEXT = context;
      }
    }
  
    get() {
      const data = localStorage.getItem(this.CONTEXT);
      return data ? JSON.parse(data) : null;
    }
    save(data: any, context?: string) {
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
  }