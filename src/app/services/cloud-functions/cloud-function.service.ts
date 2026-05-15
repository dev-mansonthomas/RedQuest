import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { ULDetails } from '../../model/ULDetails';
import { ULPrefs } from '../../model/ULPrefs';
import { ULStats } from '../../model/ULStats';
import { HistoriqueTroncQueteur } from '../../model/historiqueTroncQueteur';
import { Queteur } from '../../model/queteur';
import { Tronc } from '../../model/tronc';

@Injectable({
  providedIn: 'root'
})
export class CloudFunctionService {
  private readonly baseUrl = environment.cloudFunctionsBaseUrl;
  private readonly functionNames = environment.cloudFunctionsNames;

  constructor(private http: HttpClient) { }

  findQueteurById$ = (): Observable<Queteur> =>
    this.http.get<Queteur>(this.url(this.functionNames.findQueteurById))

  findULDetailsByToken$ = (token: string): Observable<ULDetails> =>
    this.http.get<ULDetails>(`${this.url(this.functionNames.findULDetailsByToken)}?token=${token}`)

  getULPrefs$ = (): Observable<ULPrefs> =>
    this.http.get<ULPrefs>(this.url(this.functionNames.getULPrefs))

  getULStats$ = (): Observable<ULStats> =>
    this.http.get<ULStats>(this.url(this.functionNames.getULStats))

  registerQueteur$ = (user: Queteur): Observable<{ queteur_registration_token: string }> =>
    this.http.post<{ queteur_registration_token: string }>(
      this.url(this.functionNames.registerQueteur),
      user
    )

  retrievePreparedTroncs$ = (): Observable<Tronc[]> =>
    this.http.get<Tronc[]>(this.url(this.functionNames.troncListPrepared))
      .pipe(map(rows => rows.map(row => this.parseTroncDates(row))))

  troncStateUpdate$ = (troncUpdate: { isDepart: boolean, date: string, tqId: number }): Observable<{ success: boolean }> =>
    this.http.post<{ success: boolean }>(
      this.url(this.functionNames.troncSetDepartOrRetour),
      troncUpdate
    )

  historiqueTroncQueteur$ = (): Observable<HistoriqueTroncQueteur[]> =>
    this.http.get<HistoriqueTroncQueteur[]>(this.url(this.functionNames.historiqueTroncQueteur))

  private url(name: string): string {
    return `${this.baseUrl}${name}`;
  }

  private parseTroncDates(row: any): Tronc {
    if (row.depart_theorique) {
      row.depart_theorique = new Date(row.depart_theorique);
    }
    if (row.depart) {
      row.depart = new Date(row.depart);
    }
    return row as Tronc;
  }
}
