import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';

import { Queteur } from 'src/app/model/queteur';
import { CloudFunctionService } from 'src/app/services/cloud-functions/cloud-function.service';

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
    'number_of_point_quete', 'year'];
  years = Array.from({ length: new Date().getFullYear() - 2016 + 1 }, (_, i) => new Date().getFullYear() - i);

  year = new Date().getFullYear();
  ulPrefs: ULPrefs = null;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  queteur: Queteur;

  constructor(private functionsService: CloudFunctionService,
    private route: ActivatedRoute) {
  }


  ngOnInit(): void {
    this.dataSource = new RankingDatasource(this.functionsService);
    this.route.data.subscribe((data: { queteur: Queteur }) => {
      this.functionsService.getULPrefs$().subscribe(ulPrefs => this.ulPrefs = ulPrefs);
      this.queteur = data.queteur;
      this.dataSource.load(this.year, 10);
    });
  }

  ngAfterViewInit() {
    // sort change → in-memory re-sort, no refetch
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
      this.dataSource.sort(this.sort.active, this.sort.direction as 'asc' | 'desc', 0, this.paginator.pageSize);
    });
    this.paginator.page.subscribe(() =>
      this.dataSource.selectPage(this.paginator.pageIndex, this.paginator.pageSize));
  }

  selectPage() {
    // year change → refetch (HTTP cache 15min absorbs repeated calls)
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.dataSource.load(this.year, this.paginator ? this.paginator.pageSize : 10);
  }

  whereAmI() {
    const queteurRank = this.dataSource.retrieveRankFor(this.queteur.queteur_id);
    this.paginator.pageIndex = Math.floor(queteurRank / this.paginator.pageSize);
    this.dataSource.selectPage(this.paginator.pageIndex, this.paginator.pageSize);
  }
}
