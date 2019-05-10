import {Injectable} from '@angular/core';
import {CloudFunctionService} from '../cloud-functions/cloud-function.service';
import {QueteurService} from '../queteur/queteur.service';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QueteurUlInfoService {

  data: any;

  constructor(private cloudFunctions: CloudFunctionService,
              private queteurService: QueteurService) {
  }

  private getQueteurUlInfo(): Promise<any> {
    return new Promise<any>(resolve => {
      if (this.data) {
        resolve(this.data);
      }
      this.cloudFunctions.findQueteurById()
        .subscribe(result => resolve(result));
    });
  }

  isSlotsUpdateActivated(): Observable<boolean> {
    return this.queteurService.getQueteur().pipe(map(queteur => queteur.rqAutonomousDepartAndReturn));
  }
}
