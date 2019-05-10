import {Injectable} from '@angular/core';
import {CloudFunctionService} from '../cloud-functions/cloud-function.service';
import {QueteurService} from '../queteur/queteur.service';

@Injectable({
  providedIn: 'root'
})
export class QueteurUlInfoService {

  data: any;

  constructor(private cloudFunctions: CloudFunctionService) {
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

  isSlotsUpdateActivated() {
    this.getQueteurUlInfo().then(result => console.log(result));
  }
}
