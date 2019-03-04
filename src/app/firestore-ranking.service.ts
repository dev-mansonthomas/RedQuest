import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/firestore";
import {UlRankingByAmount} from "./model/UlRankingByAmount";

@Injectable({
  providedIn: 'root'
})
export class FirestoreRankingService {

  constructor(private firestoreDB: AngularFirestore) {
  }

  getUlRankingByAmount(ul: string) {
    return this.firestoreDB.collection('ul_queteur_stats_per_year',
      ref => ref.where('ul_id', '==', ul))
      .snapshotChanges();
  }

  getAllUlRankingByAmount() {
    return this.firestoreDB.collection('ul_queteur_stats_per_year')
      .get();
  }
}
