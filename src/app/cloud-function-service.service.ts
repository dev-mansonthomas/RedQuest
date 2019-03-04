import { Injectable } from '@angular/core';
import {AngularFireFunctions} from "@angular/fire/functions";

@Injectable({
  providedIn: 'root'
})
export class CloudFunctionServiceService {

  constructor(private firebaseFunctions: AngularFireFunctions) { }

  findQueteurById(data: any) {
    const func = this.firebaseFunctions.httpsCallable('findQueteurById2');
    return func(data).subscribe(result => console.log(result));
  }
}
