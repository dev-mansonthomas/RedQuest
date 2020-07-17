import {DataSource} from '@angular/cdk/table';
import {CollectionViewer} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {FirestoreService} from '../../services/firestore/firestore.service';
import {catchError, finalize} from 'rxjs/operators';
import {UlRankingByAmount} from '../../model/UlRankingByAmount';

export class RankingDatasource implements DataSource<UlRankingByAmount> {
    public loading$ ;
    private objSubject     = new BehaviorSubject<UlRankingByAmount[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);


    private data: UlRankingByAmount[];

    constructor(private firestoreService: FirestoreService) {
        this.loading$ = this.loadingSubject.asObservable();
    }

    connect(collectionViewer: CollectionViewer): Observable<UlRankingByAmount[] | ReadonlyArray<UlRankingByAmount>> {
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
                finalize(() => this.loadingSubject.next(false)))
            .subscribe((objs: UlRankingByAmount[]) => {
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
        return this.data ? this.data.length : 0;
    }
}
