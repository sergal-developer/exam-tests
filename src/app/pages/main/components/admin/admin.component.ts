import { Component, Input, OnInit, ViewEncapsulation, } from '@angular/core';
import { EVENTS, ScreenEnum } from 'src/app/shared/data/enumerables/enumerables';
import { IExam } from 'src/app/shared/data/interfaces/IExam';
import { EventBusService } from 'src/app/shared/data/utils/event.services';
import { ExamsService } from 'src/app/shared/services/exams.service';
import { MainServices } from '../../main.service';
// import { EventBusService } from 'src/app/shared/data/utils/event.services';

@Component({
  selector: 'admin',
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdminComponent implements OnInit {

  _examService = new ExamsService();

  constructor(private eventService: EventBusService,
    private _mainServices: MainServices
  ) { }

  data: any = {};
  exportData: any = null;

  ngOnInit() {
    this.init();
  }

  init() {
    this.loadExam();
  }

  loadExam() {
    const exams = this._examService.getExams();
    this.updateHeaders();
  }

  updateHeaders() {
    this.data.title = 'Administración';
    this.data.questions = null;
    this.data.color = '';
    this.data.current = null;
    this.data.progress = null;
    this.data.completed = null;

    this.eventService.emit({ name: EVENTS.CONFIG, component: 'subheader', value: this.data });
  }

  export() {
    const exams = this._examService.getExams();
    // this.exportData = exams;
    this.copyClipboard(JSON.stringify(exams));
    this.downloadJSON(exams, 'collection-exam.json');
  }

  async import(evt: any) {
    var file = evt.target.files[0];
    const data = await this.readFile(file);

    try {
      const json = JSON.parse(data);
      this._examService.saveExamCollection(json);
      this._mainServices.notification('Plantilla importada exitosamente', { type: 'success', closeTimer: 5000 });
    } catch (error) {
      this._mainServices.notification('Error al importar plantilla', { type: 'warning', closeTimer: 5000 });
    }
  }

  downloadJSON(data: any, name: string) {
    try {
      var blob = new Blob([data], { type: 'application/json' });
      var url = URL.createObjectURL(blob);

      var downloadElement = document.createElement("a");
      downloadElement.href = url;
      downloadElement.download = name;

      document.body.appendChild(downloadElement);
      downloadElement.click();
      document.body.removeChild(downloadElement);
      URL.revokeObjectURL(url);
      this._mainServices.notification('Exportación exitosa', { type: 'info', closeTimer: 3000 });
    } catch (error: any) {
      this._mainServices.notification(error, { type: 'warning', closeTimer: 5000 });
    }
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
        this._mainServices.notification('Error al leer el archivo', { type: 'warning', closeTimer: 5000 });
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