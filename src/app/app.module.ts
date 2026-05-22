import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutes } from './app.routing';

import { APP_BASE_HREF } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { WebSqlite } from 'angular-web-sqlite';
import { modulePackage } from './modules/modules.module';
import { NotFoundModule } from './pages/notFound/notFound.module';
import { DatabaseService } from './shared/services/database/sql.database.service';

export function initializeApp(dbService: DatabaseService) {
  return () => dbService.initDataBase();
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppRoutes,
    BrowserModule,
    HttpClientModule,

    //Pages
    ...modulePackage.modules,
    NotFoundModule,

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory:httpTranslator,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [
    WebSqlite,
    DatabaseService,
    { provide: APP_BASE_HREF, useValue: '/' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function httpTranslator(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
