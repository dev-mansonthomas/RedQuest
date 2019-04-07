import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AngularFirestore, FirestoreSettingsToken} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import {LoginComponent} from './login/login.component';
import {RankingComponent} from './ranking/ranking.component';
import {HomepageComponent} from './homepage/homepage.component';
import {AngularFireFunctions, FunctionsRegionToken} from '@angular/fire/functions';
import {RegistrationComponent} from './registration/registration.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SortableColumnComponent} from './sort-utils/sortable-column/sortable-column.component';
import {SortableTableDirective} from './sort-utils/sortable-table.directive';
import {SortService} from "./sort-utils/sort.service";
import {RegistrationStep2Component} from './registration-step-2/registration-step-2.component';
import {WaitingModalComponent} from './waiting-modal/waiting-modal.component';
import {RegistrationConfirmationComponent} from './registration-confirmation/registration-confirmation.component';
import {QueteurHistoryComponent} from './queteur-history/queteur-history.component';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {TimePipe} from './pipes/time.pipe';
import {WeightPipe} from './pipes/weight.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RankingComponent,
    HomepageComponent,
    RegistrationComponent,
    SortableColumnComponent,
    SortableTableDirective,
    RegistrationStep2Component,
    WaitingModalComponent,
    RegistrationConfirmationComponent,
    QueteurHistoryComponent,
    TimePipe,
    WeightPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    NgxChartsModule,
    BrowserAnimationsModule
  ],
  providers: [
    AngularFirestore,
    AngularFireAuth,
    AngularFireFunctions,
    {provide: FunctionsRegionToken, useValue: 'europe-west1'},
    {provide: FirestoreSettingsToken, useValue: {}},
    SortService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
