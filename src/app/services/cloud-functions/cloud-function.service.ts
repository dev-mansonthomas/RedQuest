import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { ULDetails } from '../../model/ULDetails';
import { ULPrefs } from '../../model/ULPrefs';
import { ULStats } from '../../model/ULStats';
import { HistoriqueTroncQueteur } from '../../model/historiqueTroncQueteur';
import { Queteur } from '../../model/queteur';

@Injectable({
  providedIn: 'root'
})
export class CloudFunctionService {
  baseUrl = environment.cloudFunctionsBaseUrl;

  constructor(private firebaseFunctions: AngularFireFunctions, private http: HttpClient) { }

  findQueteurById$ = (): Observable<any> => this.firebaseFunctions.httpsCallable('findQueteurById')({});

  findULDetailsByToken$ = (token: string): Observable<ULDetails> =>
    this.http.get<ULDetails>(`${this.baseUrl}findULDetailsByToken?token=${token}`)


  getULPrefs$ = (): Observable<any> => this.firebaseFunctions.httpsCallable('getULPrefs')(ULPrefs);
  getULStats$ = (): Observable<any> => this.firebaseFunctions.httpsCallable('getULStats')(ULStats);

  registerQueteur$ = (user: Queteur): Observable<any> => this.firebaseFunctions.httpsCallable('registerQueteur')(user)
    .pipe(map(value => JSON.parse(value)))

  retrievePreparedTroncs$ = (): Observable<any> =>
    this.firebaseFunctions.httpsCallable('troncListPrepared')({})
      .pipe(map(value => JSON.parse(value, (k, v) => {
        if (k === 'depart_theorique' || k === 'depart' || k === 'arrivee') {
          return new Date(v);
        }
        return v;
      })))

  troncStateUpdate$ = (troncUpdate: { isDepart: boolean, date: string, tqId: number }): Observable<any> =>
    this.firebaseFunctions.httpsCallable('troncSetDepartOrRetour')(troncUpdate)

  historiqueTroncQueteur$ = (): Observable<HistoriqueTroncQueteur[]> => this.firebaseFunctions.httpsCallable('historiqueTroncQueteur')({});
}
