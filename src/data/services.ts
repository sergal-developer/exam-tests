export class Services {
  fileData = '/exam-tests/data/questions-db.md';

    constructor() {}
  
    async getRawData(response?: Function) {
      const data = await this.getDataFromFile();
      if(response) { response(data); }
      return data;
    }
    
    getDataFromFile() {
      return new Promise((done, reject) => {
        const data = fetch(this.fileData)
          .then((response) => response.text())
          .then((text) => done(text))
          .catch(err => {
            console.log('err: ', err);
            done(null);
          });
      });
    }
  }