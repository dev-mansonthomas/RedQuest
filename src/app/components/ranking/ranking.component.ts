import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DataSource } from '@angular/cdk/table';
import { CollectionViewer } from '@angular/cdk/collections';
import { MatSort, MatPaginator } from '@angular/material';
import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, of, merge } from 'rxjs';
import { catchError, finalize, tap, map } from 'rxjs/operators';

import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { UlRankingByAmount } from 'src/app/model/UlRankingByAmount';
import { CloudFunctionService } from 'src/app/services/cloud-functions/cloud-function.service';
import { QueteurService } from 'src/app/services/queteur/queteur.service';

export class RankingsDataSource implements DataSource<UlRankingByAmount> {

  private rankingsSubject = new BehaviorSubject<UlRankingByAmount[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  pages: Array<QueryDocumentSnapshot<UlRankingByAmount>> = [];
  constructor(private firestoreService: FirestoreService) { }

  connect(collectionViewer: CollectionViewer): Observable<UlRankingByAmount[]> {
    console.log('Connecting data source');
    return this.rankingsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.rankingsSubject.complete();
    this.loadingSubject.complete();
  }

  loadRankings(sortBy: string, sortDirection = 'desc', pageSize = 5, pageIndex = 0) {
    console.log(`[RankingsDataSource] '${sortBy}', '${sortDirection}', '${pageIndex}', '${pageSize}`, this.pages);
    this.loadingSubject.next(true);
    this.firestoreService.getAll(sortBy, sortDirection, pageSize, this.pages[pageIndex])
      .pipe(
        catchError(() => of([])),
        tap((f: firebase.firestore.QuerySnapshot) =>
          this.pages[pageIndex + 1] = f.docs[f.docs.length - 1] as QueryDocumentSnapshot<UlRankingByAmount>),
        tap((f: firebase.firestore.QuerySnapshot) => console.log('AAAA', f, 'lastVisible', f.docs[f.docs.length - 1])),
        // tap((f: firebase.firestore.QuerySnapshot) => console.log('AAAA', f.size())),
        map((f: firebase.firestore.QuerySnapshot) => f.docs.map(e => e.data() as UlRankingByAmount)),
        tap(f => console.log('[RankingsDataSource] Retrieved Ranking:', f)),
        finalize(() => this.loadingSubject.next(false)))
      .subscribe(rankings => {
        this.rankingsSubject.next(rankings as UlRankingByAmount[]);
      });
  }
}

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements AfterViewInit, OnInit {

  page = 1;
  nb: number;
  rankings: UlRankingByAmount[] = [];
  dataSource: RankingsDataSource;
  displayedColumns = ['last_name', 'tronc_count', 'amount', 'weight', 'time_spent_in_minutes',
    'unique_point_quete_count', 'year'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private firestoreService: FirestoreService,
    private functionsService: CloudFunctionService,
    private queteurService: QueteurService) {
  }

  ngOnInit(): void {
    this.dataSource = new RankingsDataSource(this.firestoreService);
  }

  ngAfterViewInit() {

    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page).pipe(tap(() => this.loadRankingsPage())).subscribe();
    this.dataSource.loadRankings(this.sort.active, this.sort.direction, this.paginator.pageSize, this.paginator.pageIndex);
    // this.firestoreService.getCount().subscribe(nb => this.nb = nb);
  }

  loadRankingsPage = () => this.dataSource.loadRankings(
    this.sort.active, this.sort.direction, this.paginator.pageSize, this.paginator.pageIndex)

  callFunction() {
    this.queteurService.getQueteur().then(queteur => {
      const data = { id: queteur.queteur_id };
      this.functionsService.findQueteurById(data);
    });
  }
}
