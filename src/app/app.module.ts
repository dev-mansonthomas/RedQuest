import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AngularFireModule} from "@angular/fire";
import {environment} from "../environments/environment";
import {AngularFireDatabaseModule} from "@angular/fire/database";
import {AngularFirestore} from "@angular/fire/firestore";
import {AngularFireAuth} from "@angular/fire/auth";
import {LoginComponent} from './login/login.component';
import {RankingComponent} from './ranking/ranking.component';
import {HomepageComponent} from './homepage/homepage.component';
import {CloudFunctionServiceService} from "./cloud-function-service.service";
import {AngularFireFunctions, FunctionsRegionToken} from "@angular/fire/functions";
import { RegistrationComponent } from './registration/registration.component';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RankingComponent,
    HomepageComponent,
    RegistrationComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule
  ],
  providers: [
    AngularFirestore,
    AngularFireAuth,
    AngularFireFunctions,
    { provide: FunctionsRegionToken, useValue: 'europe-west1' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
