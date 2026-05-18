import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { ULDetails } from '../../model/ULDetails';
import { ULPrefs } from '../../model/ULPrefs';
import { ULStats } from '../../model/ULStats';
import { UlQueteurRanking } from '../../model/UlQueteurRanking';
import { HistoriqueTroncQueteur } from '../../model/historiqueTroncQueteur';
import { Queteur } from '../../model/queteur';
import { QueteurStats } from '../../model/queteur-stats';
import { Tronc } from '../../model/tronc';

@Injectable({
  providedIn: 'root'
})
export class CloudFunctionService {
  private readonly baseUrl = environment.cloudFunctionsBaseUrl;
  private readonly functionNames = environment.cloudFunctionsNames;
  private readonly ulDetailsCachePrefix = 'rq:ul-details:';
  private readonly ulDetailsCacheTtlMs = 30 * 24 * 3600 * 1000;

  constructor(private http: HttpClient) { }

  findQueteurById$ = (): Observable<Queteur> =>
    this.http.get<Queteur>(this.url(this.functionNames.findQueteurById))

  findULDetailsByToken$ = (token: string): Observable<ULDetails> => {
    const cached = this.readULDetailsFromCache(token);
    if (cached) {
      return of(cached);
    }
    return this.http
      .get<ULDetails>(`${this.url(this.functionNames.findULDetailsByToken)}?token=${token}`)
      .pipe(tap(data => this.writeULDetailsToCache(token, data)));
  }

  getULPrefs$ = (): Observable<ULPrefs> =>
    this.http.get<ULPrefs>(this.url(this.functionNames.getULPrefs))

  getULStats$ = (): Observable<ULStats> =>
    this.http.get<ULStats>(this.url(this.functionNames.getULStats))

  getULQueteurRanking$ = (year: number): Observable<UlQueteurRanking[]> =>
    this.http.get<UlQueteurRanking[]>(`${this.url(this.functionNames.getULQueteurRanking)}?year=${year}`)

  getQueteurStats$ = (): Observable<QueteurStats[]> =>
    this.http.get<QueteurStats[]>(this.url(this.functionNames.getQueteurStats))

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

  private readULDetailsFromCache(token: string): ULDetails | null {
    const key = this.ulDetailsCachePrefix + token;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) {
        return null;
      }
      const { ts, data } = JSON.parse(raw);
      if (typeof ts !== 'number' || Date.now() - ts > this.ulDetailsCacheTtlMs) {
        localStorage.removeItem(key);
        return null;
      }
      return data as ULDetails;
    } catch {
      return null;
    }
  }

  private writeULDetailsToCache(token: string, data: ULDetails): void {
    try {
      localStorage.setItem(
        this.ulDetailsCachePrefix + token,
        JSON.stringify({ ts: Date.now(), data })
      );
    } catch {
      // localStorage unavailable (private mode, quota); cache disabled silently
    }
  }
}
