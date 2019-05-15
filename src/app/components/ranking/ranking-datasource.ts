import {DataSource} from '@angular/cdk/table';
import {CollectionViewer} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {FirestoreService} from '../../services/firestore/firestore.service';
import {catchError, finalize, map, tap} from 'rxjs/operators';

export class RankingDatasource<T> implements DataSource<T> {

  private objSubject = new BehaviorSubject<T[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  private data: T[];

  constructor(private firestoreService: FirestoreService) {
  }

  connect(collectionViewer: CollectionViewer): Observable<T[] | ReadonlyArray<T>> {
    console.log('Connecting data source');
    return this.objSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.objSubject.complete();
    this.loadingSubject.complete();
  }

  selectUlStats(sortBy: string,
                ul_id: number,
                year: number,
                sortDirection: 'desc' | 'asc' = 'desc',
                pageSize = 10
  ) {
    this.loadingSubject.next(true);
    this.firestoreService.getUlStatsOrderedBy(sortBy, sortDirection, ul_id, year)
      .pipe(
        catchError(error => of(error)),
        map((f: firebase.firestore.QuerySnapshot) => f.docs.map(e => e.data() as T)),
        tap(f => console.log('[FirestoreDataSource] Retrieved objects:', f)),
        finalize(() => this.loadingSubject.next(false)))
      .subscribe((objs: T[]) => {
        this.data = objs;
        this.selectPage(0, pageSize);
      });
  }

  selectPage(pageIndex, pageSize) {
    return this.objSubject.next(this.data.slice(pageIndex * pageSize, ((pageIndex + 1) * pageSize)));
  }

  retrieveRankFor(queteur_id: number): number {
    return this.data.map(rank => rank.queteur_id === queteur_id).indexOf(true);
  }

  count() {
    return this.data.length;
  }
}
