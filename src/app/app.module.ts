import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import {LoginComponent} from './login/login.component';
import {RankingComponent} from './ranking/ranking.component';
import {HomepageComponent} from './homepage/homepage.component';
import {AngularFireFunctions, FunctionsRegionToken} from '@angular/fire/functions';
import {RegistrationComponent} from './registration/registration.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import { SortableColumnComponent } from './sort-utils/sortable-column/sortable-column.component';
import { SortableTableDirective } from './sort-utils/sortable-table.directive';
import {SortService} from "./sort-utils/sort.service";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RankingComponent,
    HomepageComponent,
    RegistrationComponent,
    SortableColumnComponent,
    SortableTableDirective
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
    {provide: FunctionsRegionToken, useValue: 'europe-west1'},
    SortService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
