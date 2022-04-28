import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localeFrExtra from '@angular/common/locales/extra/fr';
import localeFr from '@angular/common/locales/fr';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestore, SETTINGS } from '@angular/fire/firestore';
import { AngularFireFunctionsModule, REGION } from '@angular/fire/functions';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CookieService } from 'ngx-cookie-service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreditsComponent } from './components/credits/credits.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { LocalUnitComponent } from './components/local-unit/local-unit.component';
import { MapComponent } from './components/map/map.component';
import { RankingComponent } from './components/ranking/ranking.component';
import { TipsComponent } from './components/tips/tips.component';
import { SharedModule } from './shared.module';

import { environment } from '../environments/environment';
import {MAT_DATE_LOCALE} from '@angular/material/core';


registerLocaleData(localeFr, 'fr-FR', localeFrExtra);

@NgModule({
    declarations: [
        AppComponent,
        RankingComponent,
        HomepageComponent,
        TipsComponent,
        CreditsComponent,
        LocalUnitComponent,
        MapComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        SharedModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireFunctionsModule,
        AngularFireDatabaseModule,
        BrowserAnimationsModule
    ],
    providers: [
        AngularFirestore, AngularFireAuth, CookieService,
        { provide: REGION, useValue: 'europe-west1' },
        { provide: MAT_DATE_LOCALE, useValue: 'fr-FR'},
        { provide: SETTINGS, useValue: {} }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
