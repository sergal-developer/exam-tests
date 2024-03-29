import { Utils } from '../data/utils/utils';
import { LocalStorage } from './storage/localstorage';

export class ExamsService {
  context = 'EXAMS';
  storage = new LocalStorage(this.context);
  utils = new Utils();

  constructor() {}

  getExams() {
    return this.storage.getData(this.context);
  }

  saveExams(data: any) {
    data.id = data.id ?? this.utils.createPattern('id-xxxxxx');
    return this.storage.saveInArray(data, data.id, this.context);
  }

  updateTempExam() {
    const data = this.getExams();
    return data || [];
  }

}
