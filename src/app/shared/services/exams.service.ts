import { IExam } from '../data/interfaces/IExam';
import { Utils } from '../data/utils/utils';
import { LocalStorage } from './storage/localstorage';

export class ExamsService {
  context = 'EXAMS';
  contextTemporal = 'EXAMSTEMP';
  storage = new LocalStorage(this.context);
  utils = new Utils();

  constructor() {}

  getExams(): Array<IExam> {
    const data = this.storage.getData(this.context);
    return data || [];
  }

  getExamById(id: string): Array<IExam>  {
    const data = this.getExams();
    const result = data?.filter((x: IExam) => x.id === id);
    return result || [];
  }

  saveExam(data: any) {
    data.id = data.id ?? this.utils.createPattern('xxxxxx');
    return this.storage.saveInArray(data, 'id', this.context);
  }

  saveExamCollection(data: any) {
    return this.storage.saveInObject(data, this.context);
  }

  updateExams(data: IExam) {
    data.id = data.id ?? this.utils.createPattern('xxxxxx');
    return this.storage.saveInArray(data, 'id', this.context);
    
    // const list = this.getExams();
    // const index = list.findIndex((item: IExam) => item.id === data.id);
    // if(index >= 0) {
    //   list[index] = data;
    // }
    
  }

  updateTempExam() {
    const data = this.getExamTemporal();
    return data || [];
  }

  getExamTemporal(): IExam | null {
    return this.storage.getData(this.contextTemporal);
  }

  saveExamTemporal(data: any) {
    return this.storage.saveInObject(data, this.contextTemporal);
  }

}
