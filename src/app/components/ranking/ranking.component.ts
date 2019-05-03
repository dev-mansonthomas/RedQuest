import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatSort, MatPaginator } from '@angular/material';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';

import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { FirestoreDataSource } from 'src/app/services/firestore/firestore.datasource';
import { UlRankingByAmount } from 'src/app/model/UlRankingByAmount';
import { CloudFunctionService } from 'src/app/services/cloud-functions/cloud-function.service';
import { QueteurService } from 'src/app/services/queteur/queteur.service';

@Component({
  templateUrl: './ranking.component.html'
})
export class RankingComponent implements AfterViewInit, OnInit {

  dataSource: FirestoreDataSource<UlRankingByAmount>;
  displayedColumns = ['last_name', 'tronc_count', 'amount', 'weight', 'time_spent_in_minutes',
    'unique_point_quete_count', 'year'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private firestoreService: FirestoreService,
    private functionsService: CloudFunctionService,
    private queteurService: QueteurService) {
  }

  ngOnInit(): void {
    this.dataSource = new FirestoreDataSource(this.firestoreService, 'ul_queteur_stats_per_year');
  }

  ngAfterViewInit() {
    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page).pipe(tap(() => this.selectPage())).subscribe();
    this.dataSource.select(this.sort.active, this.sort.direction, this.paginator.pageSize, this.paginator.pageIndex);
    // Load the entire base to count nb of items :o 
    // Thus, DON'T DO THAT:
    // this.firestoreService.getCount().subscribe(nb => this.nb = nb);
  }

  selectPage = () => this.dataSource.select(
    this.sort.active, this.sort.direction, this.paginator.pageSize, this.paginator.pageIndex)

  callFunction() {
    this.queteurService.getQueteur().then(queteur => {
      const data = { id: queteur.queteur_id };
      this.functionsService.findQueteurById(data);
    });
  }
}
