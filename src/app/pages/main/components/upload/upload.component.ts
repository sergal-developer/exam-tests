import { Component, Input, OnInit, ViewEncapsulation, } from '@angular/core';
import { EVENTS, ScreenEnum } from 'src/app/shared/data/enumerables/enumerables';
import { IExam } from 'src/app/shared/data/interfaces/IExam';
import { EventBusService } from 'src/app/shared/data/utils/event.services';
import { ExamsService } from 'src/app/shared/services/exams.service';
// import { EventBusService } from 'src/app/shared/data/utils/event.services';

@Component({
  selector: 'upload',
  templateUrl: './upload.html',
  styleUrls: ['./upload.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UploadComponent implements OnInit {

  _examService = new ExamsService();

  constructor(private eventService: EventBusService) { }

  data: any = {};

  examsList = [];

  currentExam: IExam = {
    title: '',
    color: '',
    questionsLenght: 0,
    questions: []
  };

  ngOnInit() {
    this.init();
  }

  init() {
    this.loadExam();
  }

  loadExam() {
    const exams = this._examService.getExams();
    console.log('exams: ', exams);
    this.currentExam = {
      title: 'Admin',
      color: 'gray',
      questionsLenght: 0,
      questions: [],
      time: 0
    };

    this.updateHeaders();
  }

  updateHeaders() {
    this.data.title = this.currentExam.title;
    this.data.questions = this.currentExam.questionsLenght;
    this.data.color = this.currentExam.color;
    this.data.current = 0;
    this.data.progress = `${(100 / this.currentExam.questionsLenght) * this.data.current}%`;
    this.data.completed = this.currentExam.completed;

    this.eventService.emit({ name: EVENTS.CONFIG, component: 'subheader', value: this.data });
  }

  exportData = {};
  export() {
    const exams = this._examService.getExams();
    this.exportData = exams;
    this.copyClipboard(JSON.stringify(exams));
    this.downloadJSON(exams, 'collection-exam.json');
  }

  async import(evt: any) {
    var file = evt.target.files[0];
    const data = await this.readFile(file);
    console.log('data: ', data);

    try {
      const json = JSON.parse(data);
      this._examService.saveExamsBatch(json);
    } catch (error) {
      console.log('error al importar')
    }
  }

  downloadJSON(data: any, name: string) {
    var blob = new Blob([data], { type: 'application/json' });
    var url = URL.createObjectURL(blob);

    var enlaceDescarga = document.createElement("a");
    enlaceDescarga.href = url;
    enlaceDescarga.download = name;

    document.body.appendChild(enlaceDescarga);
    enlaceDescarga.click();
    document.body.removeChild(enlaceDescarga);
    URL.revokeObjectURL(url);
  }

  readFile(archivo: any): Promise<string> {
    return new Promise((resolve) => {
      var lector = new FileReader();

      lector.onload = (evento: any) => {
        var contenido = evento.target.result;
        resolve(contenido);
      };
  
      lector.onerror = (evento: any) => {
        console.warn("Error al leer el archivo:", evento.target.error);
        resolve('');
      };
  
      lector.readAsText(archivo);
    });
  }

  copyClipboard(text: string) {
    var temp = document.createElement("textarea");
    temp.value = text;
    document.body.appendChild(temp);
    temp.select();
    var success = document.execCommand("copy");
    document.body.removeChild(temp);
    return success;
}
}