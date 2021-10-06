import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  ServicesAgreementComponent,
} from './register/services-agreement/services-agreement.component';

import {IonicModule} from '@ionic/angular';

import {AuthPageRoutingModule} from './auth-routing.module';

import {AuthPage} from './auth.page';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AuthPageRoutingModule,
    TranslateModule,
    ReactiveFormsModule,
  ],
  declarations: [
    AuthPage,
    LoginComponent,
    RegisterComponent,
    ServicesAgreementComponent,
  ],
})
export class AuthPageModule {}
