import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {MenuComponent} from './body/menu/menu.component';
import {BodyComponent} from './body/body.component';
import {ContentComponent} from './body/content/content.component';
import {ProjectFormComponent} from './body/content/project-form/project-form.component';
import {ProjectListComponent} from './body/content/project-list/project-list.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule, Routes} from "@angular/router";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {ProjectService} from "./services/project.service";
import {GroupService} from "./services/group.service";
import {ErrorPageComponent} from './body/error-page/error-page.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {SearchService} from "./services/search.service";
import {DatePipe} from '@angular/common';
import {ErrorService} from "./services/error.service";
import {PaginateService} from "./services/paginate.service";
import { TagInputModule } from 'ngx-chips';
import {EmployeeService} from "./services/employee.service";

const appRoutes: Routes = [
  {path: '', redirectTo: 'project-list', pathMatch: 'full'},
  {path: 'project-list', component: ProjectListComponent},
  {path: 'project-form', component: ProjectFormComponent},
  {path: 'project-form/:id', component: ProjectFormComponent},
  {path: 'error', component: ErrorPageComponent}
]

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MenuComponent,
    BodyComponent,
    ContentComponent,
    ProjectFormComponent,
    ProjectListComponent,
    ErrorPageComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    HttpClientModule,
    TagInputModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })

  ],
  providers: [ProjectService, GroupService, SearchService, DatePipe, ErrorService, PaginateService, EmployeeService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
