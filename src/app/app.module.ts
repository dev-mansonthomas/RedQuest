import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestore, FirestoreSettingsToken } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { AngularFireFunctions, FunctionsRegionToken } from '@angular/fire/functions';

import { NgxPaginationModule } from 'ngx-pagination';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { LoginComponent } from './components/login/login.component';
import { RankingComponent } from './components/ranking/ranking.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { SortableColumnComponent } from './sort-utils/sortable-column/sortable-column.component';
import { SortableTableDirective } from './sort-utils/sortable-table.directive';
import { WaitingModalComponent } from './components/waiting-modal/waiting-modal.component';
import { QueteurHistoryComponent } from './components/queteur-history/queteur-history.component';
import { TimePipe } from './pipes/time.pipe';
import { WeightPipe } from './pipes/weight.pipe';
import { TipsComponent } from './components/tips/tips.component';
import { MySlotsComponent } from './components/my-slots/my-slots.component';
import { MyDataComponent } from './components/my-data/my-data.component';
import { CustomPaginationComponent } from './components/custom-pagination/custom-pagination.component';
import { BadgesComponent } from './components/badges/badges.component';
import { RegisterTroncStateComponent } from './components/my-slots/register-tronc-state/register-tronc-state.component';
import { QuestPointComponent } from './components/quest-point/quest-point.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RankingComponent,
    HomepageComponent,
    SortableColumnComponent,
    SortableTableDirective,
    WaitingModalComponent,
    QueteurHistoryComponent,
    TimePipe,
    WeightPipe,
    TipsComponent,
    MySlotsComponent,
    MyDataComponent,
    CustomPaginationComponent,
    BadgesComponent,
    RegisterTroncStateComponent,
    QuestPointComponent
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
    { provide: FunctionsRegionToken, useValue: 'europe-west1' },
    { provide: FirestoreSettingsToken, useValue: {} }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
