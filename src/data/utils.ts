export class Utils {
  assignDataInner(data, selector) {
    const html = document.querySelector(selector);
    if (html) {
      html.innerHTML = data;
    } else {
      console.warn(`The selector ${selector} not found in current html.`);
    }
  }

  assignProperty(selector, properties: any) {
    const html = document.querySelector(selector);
    const props = [];
    // const classAttr = properties['class'];
    // const styleAttr = properties['style'];

    if (html) {
      for (let attr in properties) {
        html.setAttribute(attr, properties[attr]);
      }
    } else {
      console.warn(`The selector ${selector} not found in current html.`);
    }
  }

  redirect(url, queryParams?: any) {
    window.location.href = this.urlSerializer(url, queryParams);
  }

  private urlSerializer(url: string, params?: object) {
    let paramsSerialized = '';
    if (params) {
      paramsSerialized = '?';
      Object.keys(params).forEach(key => {
        let value = params[key];
        if (value || value !== undefined && value !== null && value !== '') {
          paramsSerialized += `${key}=${encodeURI(params[key])}&`;
        }
      });
    }
    return url + paramsSerialized;
  }
}