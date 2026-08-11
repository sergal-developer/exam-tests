import { Component, OnInit, ViewEncapsulation, } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
    answer_attempt_querys,
    answer_option_querys,
    answer_querys,
    language_querys,
    log_querys,
    quiz_attempt_querys,
    quiz_querys,
    settings_querys,
    theme_querys,
    user_querys } from "../../../shared/data/entities/dtos";

import { ScreenEnum } from 'src/app/shared/data/enumerables/enumerables';
import { CommonServices } from 'src/app/shared/services/common.services';
import { DatabaseService } from 'src/app/shared/services/database/sql.database.service';
import { UiServices } from 'src/app/shared/services/ui.services';

@Component({
  selector: 'dbclient',
  templateUrl: './dbclient.html',
  encapsulation: ViewEncapsulation.None,
})
export class DbClientComponent implements OnInit {

  //#region INTERNAL VARS
  form: FormGroup;

  formClient: FormGroup = new FormGroup({
      nameQuery: new FormControl('default', Validators.required),
      query: new FormControl(`SELECT * FROM sqlite_master WHERE type='table';`)
  });

  errorMessages = '';
  response = '';

  listQuerys: Array<{ queryName: string, query: string}> = [];
  //#endregion INTERNAL VARS

  constructor(private _commonService: CommonServices,
    private services: DatabaseService,
    public _uiServices: UiServices) { }

  async ngOnInit() {
    this.getAllAvailableQuerys();
  }

  // #region DATA
  getAllAvailableQuerys() {
    const queryGroups = [
      { name: 'answer_attempt', data: answer_attempt_querys },
      { name: 'answer_option', data: answer_option_querys },
      { name: 'answer', data: answer_querys },
      { name: 'language', data: language_querys },
      { name: 'log', data: log_querys },
      { name: 'quiz_attempt', data: quiz_attempt_querys },
      { name: 'quiz', data: quiz_querys },
      { name: 'settings', data: settings_querys },
      { name: 'theme', data: theme_querys },
      { name: 'user', data: user_querys },
    ];

    this.listQuerys = this.buildQueryList(queryGroups);
    console.log('this.listQuerys: ', this.listQuerys);
  }

  private buildQueryList(queryGroups: Array<any>) {
    const list: Array<{ queryName: string, query: string}> = [];
    queryGroups.flatMap(({ name, data}) => {
      Object.entries(data).flatMap(([groupName, queries]) => {
        Object.entries(queries).map(([queryName, query]) => {
          const item = { queryName: `${name}.${groupName}`, query: query };
          list.push(item);
        })
      });
    });
    return list;
  };
  //#endregion DATA

  //#region EVENTS
  gotoDashboard() {
    this._commonService.navigate('dashboard');
  }

  async executeQuery() {
    const { nameQuery, query } = this.formClient.value;
    if(!query) {
      this.errorMessages = 'query no exist';
      return;
    }

    const response = await this.services.executeInSQL(query, null, (log) => {
      this.errorMessages = log || '';
    });
    this.response = response ? JSON.stringify(response, null, 2) : '';
  }

  onSelectAutocomplete(data: { queryName: string, query: string}) {
    if(!data) 
      return;

    this.formClient.get('query').setValue(data.query);
  }
  //#endregion EVENTS
}
