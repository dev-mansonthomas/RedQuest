import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root'
})
export class FirestoreRankingService {

  constructor(private firestore: AngularFirestore) {
  }

  getUlRankingByAmount(ul: string) {
    return this.firestore.collection('ul_queteur_stats_per_year',
      ref => ref.where('ul_id', '==', ul))
      .snapshotChanges();
  }

  getAllUlRankingByAmount() {
    return this.firestore.collection('ul_queteur_stats_per_year')
      .snapshotChanges();
  }
}
