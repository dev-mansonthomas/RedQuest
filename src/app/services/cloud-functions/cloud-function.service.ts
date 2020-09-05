import {Injectable} from '@angular/core';
import {AngularFireFunctions} from '@angular/fire/functions';
import {HttpClient} from '@angular/common/http';

import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {ULDetails} from '../../model/ULDetails';
import {map} from 'rxjs/operators';
import {Queteur} from '../../model/queteur';
import {HistoriqueTroncQueteur} from '../../model/historiqueTroncQueteur';
import {ULPrefs} from '../../model/ULPrefs';
import {ULStats} from '../../model/ULStats';

@Injectable({
  providedIn: 'root'
})
export class CloudFunctionService {
  baseUrl = environment.cloudFunctionsBaseUrl;

  constructor(private firebaseFunctions: AngularFireFunctions,
              private http: HttpClient)
  {
  }

  findQueteurById(): Observable<any> {
    const func = this.firebaseFunctions.httpsCallable('findQueteurById');
    return func({});
  }

  findULDetailsByToken(token: string): Observable<ULDetails> {
    return this.http.get<ULDetails>(this.baseUrl + 'findULDetailsByToken?token=' + token);
  }

  getULPrefs(): Observable<any> {
    return this.firebaseFunctions.httpsCallable('getULPrefs')(ULPrefs)
        .pipe(
            map(
                value =>value
            )
        );
  }

  getULStats(): Observable<any> {
    return this.firebaseFunctions.httpsCallable('getULStats')(ULStats)
        .pipe(
            map(
                value =>value
            )
        );
  }

  registerQueteur(user: Queteur): Observable<any> {
    return this.firebaseFunctions.httpsCallable('registerQueteur')(user)
      .pipe(map(value => JSON.parse(value)));
  }

  retrievePreparedTroncs(): Observable<any> {
    return this.firebaseFunctions.httpsCallable('troncListPrepared')({})
      .pipe(map(value => JSON.parse(value, (k, v) => {
        if (k === 'depart_theorique' || k === 'depart' || k === 'arrivee') {
          return new Date(v);
        }
        return v;
      })));
  }

  troncStateUpdate(troncUpdate: {isDepart: boolean, date: string, tqId: number}): Observable<any> {
    return this.firebaseFunctions.httpsCallable('troncSetDepartOrRetour')(troncUpdate);
  }

  historiqueTroncQueteur(): Observable<HistoriqueTroncQueteur[]> {
    return this.firebaseFunctions.httpsCallable('historiqueTroncQueteur')({});
  }
}
