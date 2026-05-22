import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Fullscreen } from '@boengli/capacitor-fullscreen';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { Platform } from '@ionic/angular';
import { DatabaseService } from './shared/services/database/sql.database.service';

@Component({
  selector : 'exam-app',
  template : `<router-outlet></router-outlet>`,
  encapsulation : ViewEncapsulation.None
})
export class AppComponent implements OnInit{
  constructor(public platform: Platform, 
    private services: DatabaseService
  ) {}

  async ngOnInit() {
    this.activeFullscreen();
    this.platform.ready().then(async () => {
      if (this.platform.is('capacitor')) {
        try {
          await ScreenOrientation.lock({ orientation: 'portrait' });
        } catch (error) {
          console.error('Error al bloquear la orientación:', error);
        }
      }
    });

    this.getTheme();
  }

  async activeFullscreen() {
    try {
      await Fullscreen?.activateImmersiveMode();
    } catch (error) {
      // console.error('Error activando fullscreen:', error);
    }
  }

  async getTheme() {
    const dataNames = await this.services.deleteStructure();
    console.log('dataNames: ', dataNames);
    const data = await this.services.getStructure();
    console.log('data: ', data);
  }
}
