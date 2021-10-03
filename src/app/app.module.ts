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
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
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
import {ProductService} from './services/product.service';
import {ProductListComponent} from './body/content/product-list/product-list.component';
import { ProductDetailComponent } from './body/content/product-detail/product-detail.component';
import {MatCardModule} from '@angular/material/card';
import {ProductSearchService} from './services/product-search.service';
import { ShoppingCartComponent } from './body/content/shopping-cart/shopping-cart.component';
import {ShoppingCartService} from './services/shopping-cart.service';
import {MatDialogModule} from '@angular/material/dialog';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { PaymentInfoComponent } from './body/content/payment-info/payment-info.component';
import {AuthenticationService} from './services/authentication.service';
import {AuthInterceptor} from './interceptor/auth.interceptor';
import {NotificationModule} from './notification.module';
import {NotificationService} from './services/notification.service';
import { LoginComponent } from './body/content/login/login.component';
import { RegisterComponent } from './body/content/register/register.component';
import {AuthenticationGuard} from './guard/authentication.guard';
import { VerifyComponent } from './body/content/verify/verify.component';
import {MatStepperModule} from '@angular/material/stepper';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatRippleModule} from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';

const appRoutes: Routes = [
  {path: '', redirectTo: 'product-list', pathMatch: 'full'},
  {path: 'project-list', component: ProjectListComponent, canActivate: [AuthenticationGuard]},
  {path: 'project-form', component: ProjectFormComponent, canActivate: [AuthenticationGuard]},
  {path: 'project-form/:id', component: ProjectFormComponent, canActivate: [AuthenticationGuard]},
  {path: 'product-list', component: ProductListComponent},
  {path: 'product-detail/:id', component: ProductDetailComponent},
  {path: 'shopping-cart', component: ShoppingCartComponent},
  {path: 'payment-info', component: PaymentInfoComponent},
  {path: 'login', component: LoginComponent},
  {path: 'verify', component: VerifyComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'error', component: ErrorPageComponent},
];

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
    ProductListComponent,
    ProductDetailComponent,
    ShoppingCartComponent,
    PaymentInfoComponent,
    LoginComponent,
    RegisterComponent,
    VerifyComponent,
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
    }),
    MatCardModule,
    MatDialogModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    NotificationModule
  ],
  providers: [ProjectService, GroupService, SearchService, DatePipe, ErrorService,
              PaginateService, EmployeeService, ProductService, ProductSearchService,
              ShoppingCartService, AuthenticationService, NotificationService,
    {
      provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
