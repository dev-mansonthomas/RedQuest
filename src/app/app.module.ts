import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AngularFirestore, FirestoreSettingsToken} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import {LoginComponent} from './components/login/login.component';
import {RankingComponent} from './components/ranking/ranking.component';
import {HomepageComponent} from './components/homepage/homepage.component';
import {AngularFireFunctions, FunctionsRegionToken} from '@angular/fire/functions';
import {RegistrationComponent} from './components/registration/registration.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SortableColumnComponent} from './sort-utils/sortable-column/sortable-column.component';
import {SortableTableDirective} from './sort-utils/sortable-table.directive';
import {SortService} from './sort-utils/sort.service';
import {RegistrationStep2Component} from './components/registration-step-2/registration-step-2.component';
import {WaitingModalComponent} from './components/waiting-modal/waiting-modal.component';
import {RegistrationConfirmationComponent} from './components/registration-confirmation/registration-confirmation.component';
import {QueteurHistoryComponent} from './components/queteur-history/queteur-history.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TimePipe} from './pipes/time.pipe';
import {WeightPipe} from './pipes/weight.pipe';
import {TipsComponent} from './components/tips/tips.component';
import {MySlotsComponent} from './components/my-slots/my-slots.component';
import {MyDataComponent} from './components/my-data/my-data.component';
import {RegistrationNeededComponent} from './components/registration-needed/registration-needed.component';
import {CustomPaginationComponent} from './components/custom-pagination/custom-pagination.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {BadgesComponent} from './components/badges/badges.component';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {TimepickerModule} from 'ngx-bootstrap/timepicker';
import {RegisterTroncStateComponent} from "./components/my-slots/register-tronc-state/register-tronc-state.component";

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
    WeightPipe,
    TipsComponent,
    MySlotsComponent,
    MyDataComponent,
    RegistrationNeededComponent,
    CustomPaginationComponent,
    BadgesComponent,
    RegisterTroncStateComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    BrowserAnimationsModule,
    NgxPaginationModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot()
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
