import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
//import { HTTP_INTERCEPTORS } from '@angular/common/http';

//import { NoopInterceptor } from './service/message.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MessagelistComponent } from './messagelist/messagelist.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { CognitoService } from './service/cognito.service';
import { MessageService } from './service/message.service';
import { SignupComponent } from './signup/signup.component';
import { ConfirmComponent } from './confirm/confirm.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MessagelistComponent,
    DashboardComponent,
    SignupComponent,
    ConfirmComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [/*{
    provide: HTTP_INTERCEPTORS,
    useClass: NoopInterceptor,
    multi: true,
  },*/
  CognitoService, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
