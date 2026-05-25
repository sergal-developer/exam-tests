import { Component, Input, OnInit, ViewEncapsulation, } from '@angular/core';
import { UserDTO } from 'src/app/shared/data/entities/dtos';
import { CommonServices } from 'src/app/shared/services/common.services';

@Component({
  selector: 'header',
  templateUrl: './header.html',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit {
  @Input() mode: 'dashboard' | 'settings' | 'quiz' | 'result' | 'quizeditable' = 'dashboard';
  @Input() title: string = '';
  @Input() dashbaordparent: string = null;

  profile: UserDTO = {
    userId: null,
    current: false,
    userName: '',
    uuid: '',
    age: null,
    avatarUrl: null,
    avatarBody: null,
  };

  constructor(private _commonService: CommonServices) { }

  ngOnInit() {
    this.getCurrentProfile();
  }

  async getCurrentProfile() {
    this.profile = await this._commonService.getCurrentUser();
  }

  gotoSettings() {
    this._commonService.navigate('settings');
  }

  gotoDashboard() {
    if(this.dashbaordparent) {
      	this._commonService.navigate('dashboard', this.dashbaordparent );
    }

    if(!this.dashbaordparent) { 
      this._commonService.navigate('dashboard');
    }
  }
}
