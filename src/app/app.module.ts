import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestore, FirestoreSettingsToken } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { AngularFireFunctions, FunctionsRegionToken } from '@angular/fire/functions';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { LoginComponent } from './components/login/login.component';
import { RankingComponent } from './components/ranking/ranking.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { SortableColumnComponent } from './sort-utils/sortable-column/sortable-column.component';
import { SortableTableDirective } from './sort-utils/sortable-table.directive';
import { WaitingModalComponent } from './components/waiting-modal/waiting-modal.component';
import { TipsComponent } from './components/tips/tips.component';
import { CustomPaginationComponent } from './components/custom-pagination/custom-pagination.component';
import { QuestPointComponent } from './components/quest-point/quest-point.component';
import { SharedModule } from './shared.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RankingComponent,
    HomepageComponent,
    SortableColumnComponent,
    SortableTableDirective,
    WaitingModalComponent,
    TipsComponent,
    CustomPaginationComponent,
    QuestPointComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    BrowserAnimationsModule
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
