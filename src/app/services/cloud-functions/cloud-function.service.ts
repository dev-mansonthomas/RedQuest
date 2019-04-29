import {Injectable} from '@angular/core';
import {AngularFireFunctions} from '@angular/fire/functions';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {ULDetails} from '../../model/ULDetails';
import {map} from 'rxjs/operators';
import {Queteur} from '../../model/queteur';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class CloudFunctionService {
  baseUrl = environment.cloudFunctionsBaseUrl;

  constructor(private firebaseFunctions: AngularFireFunctions, private http: HttpClient) {
  }

  findQueteurById(data: any) {
    const func = this.firebaseFunctions.httpsCallable('findQueteurById');
    return func(data).subscribe(result => console.log(result));
  }

  findULDetailsByToken(token: string): Observable<ULDetails> {
    return this.http.get(this.baseUrl + 'findULDetailsByToken?token=' + token)
      .pipe(map(result => new ULDetails(result)));
  }

  registerQueteur(user: Queteur): Observable<any> {
    return this.firebaseFunctions.httpsCallable('registerQueteur')(user)
      .pipe(map(value => JSON.parse(value)));
  }

  retrievePreparedTroncs(): Observable<any> {
    return this.firebaseFunctions.httpsCallable('tronc_listPrepared')({})
      .pipe(map(value => JSON.parse(value, (k, v) => {
        if (k === 'depart_theorique' || k === 'depart' || k === 'arrivee') {
          return moment(v);
        }
        return v;
      })));
  }
}
