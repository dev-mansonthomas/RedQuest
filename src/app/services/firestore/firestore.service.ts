import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

import { Queteur } from '../../model/queteur';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestoreDB: AngularFirestore) { }

  getCount = () => this.firestoreDB.collection('ul_queteur_stats_per_year').get().pipe(map(snap => snap.size));

  select = (dbname: string, sortBy: string, asort = 'desc', pageSize = 10, startAt = null) => {
    const sort = ((asort as firebase.firestore.OrderByDirection) ? asort : 'desc') as firebase.firestore.OrderByDirection;
    return this.firestoreDB.collection(dbname, ref =>
      startAt ? ref.orderBy(sortBy, sort).startAfter(startAt).limit(pageSize) : ref.orderBy(sortBy, sort).limit(pageSize)
    ).get();
  }

  // Two functions below to BE REMOVED (Nicolas)
  private getAllUlRankingByAmount() {
    return this.firestoreDB.collection('ul_queteur_stats_per_year')
      .get();
  }
  private getUlRankingByAmount(ul: string) {
    return this.firestoreDB.collection('ul_queteur_stats_per_year',
      ref => ref.where('ul_id', '==', ul))
      .snapshotChanges();
  }


  getQueteurStats(queteur_id: string) {
    return this.firestoreDB.collection('ul_queteur_stats_per_year', ref => ref.where('queteur_id', '==', queteur_id))
      .get();
  }

  registerQueteur(userId: string, user: Queteur) {
    return this.firestoreDB.collection('queteurs').doc(userId).set(Object.assign({}, user));
  }

  getStoredQueteur(authId: string): Promise<Queteur> {
    Number(1);
    return this.firestoreDB.firestore
      .collection('queteurs')
      .doc(authId)
      .get()
      .then(doc => doc.data() as Queteur);
  }
}
