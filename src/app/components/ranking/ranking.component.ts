import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';

import { UlRankingByAmount } from 'src/app/model/UlRankingByAmount';
import { Queteur } from 'src/app/model/queteur';
import { CloudFunctionService } from 'src/app/services/cloud-functions/cloud-function.service';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';

import { RankingDatasource } from './ranking-datasource';

import { environment } from '../../../environments/environment';
import {ULPrefs} from '../../model/ULPrefs';

@Component({
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements AfterViewInit, OnInit {

  enabled = environment.ranking_enabled;

  dataSource: RankingDatasource;
  displayedColumns = ['last_name', 'number_of_tronc_queteur', 'amount', 'weight', 'time_spent_in_minutes',
    'unique_point_quete_count', 'year'];
  years = [2016, 2017, 2018, 2019, 2020];

  ul_id: number;
  year = new Date().getFullYear();
  ulPrefs: ULPrefs = null;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  queteur: Queteur;

  constructor(private firestoreService: FirestoreService,
    private functionsService: CloudFunctionService,
    private route: ActivatedRoute) {
  }


  ngOnInit(): void {
    this.dataSource = new RankingDatasource(this.firestoreService);
    this.route.data.subscribe((data: { queteur: Queteur }) => {
      this.functionsService.getULPrefs$().subscribe(ulPrefs => this.ulPrefs = ulPrefs);
      this.queteur = data.queteur;
      this.ul_id = this.queteur.ul_id;
      this.dataSource.selectUlStats('amount', this.ul_id, this.year, 'desc', 10);
    });
  }

  ngAfterViewInit() {
    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
      this.selectPage();
    });
    this.paginator.page.subscribe(() => this.dataSource.selectPage(this.paginator.pageIndex, this.paginator.pageSize));
    this.dataSource.selectUlStats(
      this.sort.active,
      this.ul_id,
      this.year,
      this.sort.direction as 'desc' | 'asc',
      this.paginator.pageSize
    );
  }

  selectPage() {
    this.dataSource.selectUlStats(this.sort.active, this.ul_id, this.year, this.sort.direction as 'desc' | 'asc', this.paginator.pageSize);
  }

  whereAmI() {
    const queteurRank = this.dataSource.retrieveRankFor(this.queteur.queteur_id);
    this.paginator.pageIndex = Math.floor(queteurRank / this.paginator.pageSize);
    this.dataSource.selectPage(this.paginator.pageIndex, this.paginator.pageSize);
  }
}
