import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutes } from './app.routing';
import { GlobalConstants } from './shared/services/common/globals';
import { MainModule, MainPackage } from './pages/main/main.module';

import { NotFoundModule } from './pages/notFound/notFound.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppRoutes,
    BrowserModule,

    //Pages
    ...MainPackage.modules,
    NotFoundModule
  ],
  providers: [
    GlobalConstants
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
