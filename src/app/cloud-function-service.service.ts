import {Injectable} from '@angular/core';
import {AngularFireFunctions} from "@angular/fire/functions";
import {HttpClient} from "@angular/common/http";
import {environment} from '../environments/environment';
import {Observable} from "rxjs";
import {ULDetails} from "./model/ULDetails";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class CloudFunctionServiceService {
  baseUrl = environment.cloudFunctionsBaseUrl;

  constructor(private firebaseFunctions: AngularFireFunctions, private http: HttpClient) {
  }

  findQueteurById2(data: any) {
    const func = this.firebaseFunctions.httpsCallable('findQueteurById2');
    return func(data).subscribe(result => console.log(result));
  }

  findULDetailsByToken(token: string): Observable<ULDetails> {
    return this.http.get(this.baseUrl + 'findULDetailsByToken?token=' + token)
      .pipe(map(result => new ULDetails(result[0])));
  }
}
