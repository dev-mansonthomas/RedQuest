import { DataSource } from '@angular/cdk/table';
import { CollectionViewer } from '@angular/cdk/collections';
import { QueryDocumentSnapshot } from '@angular/fire/firestore';

import { catchError, tap, map, finalize } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { FirestoreService } from './firestore.service';


export class FirestoreDataSource<T> implements DataSource<T> {

    private objSubject = new BehaviorSubject<T[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    private lastVisibles: Array<QueryDocumentSnapshot<T>> = [];

    constructor(private firestoreService: FirestoreService, private dbname: string) { }

    connect(collectionViewer: CollectionViewer): Observable<T[]> {
        console.log('Connecting data source');
        return this.objSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.objSubject.complete();
        this.loadingSubject.complete();
    }

    select(sortBy: string, sortDirection = 'desc', pageSize = 5, pageIndex = 0) {
        console.log(`[FirestoreDataSource] '${sortBy}', '${sortDirection}', '${pageIndex}', '${pageSize}`, this.lastVisibles);
        this.loadingSubject.next(true);
        this.firestoreService.select(this.dbname, sortBy, sortDirection, pageSize, this.lastVisibles[pageIndex])
            .pipe(
                catchError(() => of([])),
                tap((f: firebase.firestore.QuerySnapshot) =>
                    this.lastVisibles[pageIndex + 1] = f.docs[f.docs.length - 1] as QueryDocumentSnapshot<T>),
                map((f: firebase.firestore.QuerySnapshot) => f.docs.map(e => e.data() as T)),
                tap(f => console.log('[FirestoreDataSource] Retrieved objects:', f)),
                finalize(() => this.loadingSubject.next(false)))
            .subscribe((objs: T[]) => this.objSubject.next(objs));
    }
}