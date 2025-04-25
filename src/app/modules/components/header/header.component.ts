import { Component, Input, OnInit, ViewEncapsulation, } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileEntity } from 'src/app/shared/data/entities/entities';
import { CommonServices } from 'src/app/shared/services/common.services';

@Component({
  selector: 'header',
  templateUrl: './header.html',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit {
  @Input() mode: 'dashboard' | 'settings' | 'quiz' | 'result' | 'quizeditable' = 'dashboard';
  @Input() title: string = '';

  profile: ProfileEntity = null;

  constructor(private _commonService: CommonServices) { }

  ngOnInit() {
    this.getCurrentProfile();
  }

  async getCurrentProfile() {
    this.profile = await this._commonService.getActiveProfile();
  }

  gotoSettings() {
    this._commonService.navigate('settings');
  }

  gotoDashboard() {
    this._commonService.navigate('dashboard');
  }
}
