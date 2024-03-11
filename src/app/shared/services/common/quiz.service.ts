import { Injectable } from '@angular/core';
import { GlobalConstants } from './globals';

declare let XDomainRequest: any;
@Injectable()
export class QuizService {

  public settings: any;

  // private worker: Worker;

  constructor(private _gc: GlobalConstants) {
    // this.init ();
  }

  //#region QUIZ
  //#endregion QUIZ

  private _getWords() {
    return new Promise(((resolve, reject) => {
      let self = this;
      let xhr: any = null;
      try {
        xhr = new XMLHttpRequest();
      } catch (e) {
        console.error('IE not supported.');
      }
      xhr.open('GET', './data/words-es.json', false);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            resolve(data);
          } else {
            console.error('ERROR: Load error occurred' + xhr.statusText);
            reject(null);
          }
        }
      };
      xhr.send();
    }))
  }

  public getWords(next: Function) {
    this._getWords().then((response) => {
      next(response);
    }).catch((error) => {
      console.info('error: ', error);
      next(null)
    })
  }


  
  private _getDefaultMattersData() {
    return new Promise(((resolve, reject) => {
      let self = this;
      let xhr: any = null;
      try {
        xhr = new XMLHttpRequest();
      } catch (e) {
        console.error('IE not supported.');
      }
      xhr.open('GET', './data/matters.json', false);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            resolve(data);
          } else {
            console.error('ERROR: Load error occurred' + xhr.statusText);
            reject(null);
          }
        }
      };
      xhr.send();
    }))
  }

  private _getDefaultMattersDataExternal() {
    return new Promise((resolve, reject) => {
      const url = 'https://drive.google.com/uc?export=download&id=13BEoFSk4vPx4STNawpro29GV_q0TD2oL';
      const  url2 = 'https://drive.google.com/file/d/13BEoFSk4vPx4STNawpro29GV_q0TD2oL/view?usp=sharing';

      const options: RequestInit = {
        method: 'GET',
        headers: new Headers({ 'Content-type': 'application/octet-stream'}),
        mode: 'no-cors' 
      };
      
      fetch(url, options)
      .then(res => res.blob())
      .then(blob  => {
        console.log('data: ', blob );
        let objectURL = URL.createObjectURL(blob);
        console.log('objectURL: ', objectURL);
        resolve(blob );
      }).catch((error) => { 
        console.log(error);
        reject(null);
      });
    });
  }

  private _readTextFile(file: any, callback: any) {
    let xhr = this.createCORSRequest('GET', file);
    if (!xhr) {
      throw new Error('CORS not supported');
    }
    // xhr.overrideMimeType("application/json");
    xhr.onreadystatechange = function() {
      console.log('xhr.status: ', xhr.status);
        if (xhr.readyState === 4 && xhr.status == 200) {
            callback(xhr.responseText);
        }
    }
    xhr.send(null);
  }

  createCORSRequest(method: string, url: string) {
    var xhr:any = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
  
      // Check if the XMLHttpRequest object has a "withCredentials" property.
      // "withCredentials" only exists on XMLHTTPRequest2 objects.
      xhr.open(method, url, true);
  
    } else if (typeof XDomainRequest != "undefined") {
  
      // Otherwise, check if XDomainRequest.
      // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
      xhr = new XDomainRequest();
      xhr.open(method, url);
  
    } else {
  
      // Otherwise, CORS is not supported by the browser.
      xhr = null;
  
    }
    return xhr;
  }


  public getDefaultMattersData(next: Function) {
  //   const url = 'https://drive.google.com/uc?export=download&id=13BEoFSk4vPx4STNawpro29GV_q0TD2oL';
  //   this._readTextFile(url, (text) => {
  //     var data = JSON.parse(text);
  //     console.log(data);
  //     next(data);
  // });


    this._getDefaultMattersData().then((response) => {
      next(response);
    }).catch((error) => {
      console.info('error: ', error);
      next(null)
    })
  }
}
