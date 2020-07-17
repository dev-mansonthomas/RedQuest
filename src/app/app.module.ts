import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestore, SETTINGS } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { AngularFireFunctions, REGION } from '@angular/fire/functions';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import localeFrExtra from '@angular/common/locales/extra/fr';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { RankingComponent } from './components/ranking/ranking.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { TipsComponent } from './components/tips/tips.component';
import { SharedModule } from './shared.module';
import { CreditsComponent } from './components/credits/credits.component';
import { LocalUnitComponent } from './components/local-unit/local-unit.component';
import { MapComponent } from './components/map/map.component';


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
        AngularFireDatabaseModule,
        BrowserAnimationsModule
    ],
    providers: [
        AngularFirestore, AngularFireAuth, AngularFireFunctions,
        { provide: REGION, useValue: 'europe-west1' },
        { provide: SETTINGS, useValue: {} }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
