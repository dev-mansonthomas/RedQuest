import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';

import { of, BehaviorSubject, Observable } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { UlQueteurRanking } from '../../model/UlQueteurRanking';
import { CloudFunctionService } from '../../services/cloud-functions/cloud-function.service';

export class RankingDatasource implements DataSource<UlQueteurRanking> {

  private objSubject = new BehaviorSubject<UlQueteurRanking[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  private data: UlQueteurRanking[] = [];
  private sortBy = 'amount';
  private sortDirection: 'asc' | 'desc' = 'desc';

  constructor(private functionsService: CloudFunctionService) {
  }

  connect(collectionViewer: CollectionViewer): Observable<UlQueteurRanking[] | ReadonlyArray<UlQueteurRanking>> {
    return this.objSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.objSubject.complete();
    this.loadingSubject.complete();
  }

  load(year: number, pageSize = 10) {
    this.loadingSubject.next(true);
    this.functionsService.getULQueteurRanking$(year)
      .pipe(
        catchError(() => of([] as UlQueteurRanking[])),
        finalize(() => this.loadingSubject.next(false)))
      .subscribe((rows: UlQueteurRanking[]) => {
        this.data = rows || [];
        this.applySort();
        this.selectPage(0, pageSize);
      });
  }

  sort(sortBy: string, direction: 'asc' | 'desc', pageIndex = 0, pageSize = 10) {
    this.sortBy = sortBy || 'amount';
    this.sortDirection = direction || 'desc';
    this.applySort();
    this.selectPage(pageIndex, pageSize);
  }

  selectPage(pageIndex: number, pageSize: number) {
    return this.objSubject.next(this.data.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize));
  }

  retrieveRankFor(queteur_id: number): number {
    return this.data.map(rank => rank.queteur_id === queteur_id).indexOf(true);
  }

  count() {
    return this.data ? this.data.length : 0;
  }

  private applySort() {
    if (!this.data || this.data.length === 0) {
      return;
    }
    const key = this.sortBy;
    const sign = this.sortDirection === 'asc' ? 1 : -1;
    this.data = [...this.data].sort((a, b) => {
      const av = (a as any)[key];
      const bv = (b as any)[key];
      if (av == null && bv == null) { return 0; }
      if (av == null) { return 1; }
      if (bv == null) { return -1; }
      if (typeof av === 'string' && typeof bv === 'string') {
        return sign * av.localeCompare(bv);
      }
      return sign * (av < bv ? -1 : av > bv ? 1 : 0);
    });
  }
}
