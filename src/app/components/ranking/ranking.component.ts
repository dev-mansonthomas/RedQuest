import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {MatSort, MatPaginator} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {merge} from 'rxjs';
import {tap} from 'rxjs/operators';

import {FirestoreService} from 'src/app/services/firestore/firestore.service';
import {FirestoreDataSource} from 'src/app/services/firestore/firestore.datasource';
import {UlRankingByAmount} from 'src/app/model/UlRankingByAmount';
import {CloudFunctionService} from 'src/app/services/cloud-functions/cloud-function.service';
import {Queteur} from 'src/app/model/queteur';
import {environment} from '../../../environments/environment';

@Component({
  templateUrl: './ranking.component.html'
})
export class RankingComponent implements AfterViewInit, OnInit {

  enabled = environment.ranking_enabled;

  dataSource: FirestoreDataSource<UlRankingByAmount>;
  displayedColumns = ['last_name', 'tronc_count', 'amount', 'weight', 'time_spent_in_minutes',
    'unique_point_quete_count', 'year'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  queteur: Queteur;

  constructor(private firestoreService: FirestoreService,
              private functionsService: CloudFunctionService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.dataSource = new FirestoreDataSource(this.firestoreService, 'ul_queteur_stats_per_year');
    this.route.data.subscribe((data: { queteur: Queteur }) => this.queteur = data.queteur);
    // to avoid JS error:  Expression has changed after it was checked
    // run a first select:
    this.dataSource.select('amount');
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

}
