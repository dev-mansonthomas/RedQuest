import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Queteur } from '../../model/queteur';
import { AuthService } from '../auth/auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private authService: AuthService, private firestoreDB: AngularFirestore) {
  }

  getUlRankingByAmount(ul: string) {
    return this.firestoreDB.collection('ul_queteur_stats_per_year',
      ref => ref.where('ul_id', '==', ul))
      .snapshotChanges();
  }

  getCount = () => this.firestoreDB.collection('ul_queteur_stats_per_year').get().pipe(map(snap => snap.size));

  getAll = (sortBy: string, asort = 'desc', pageSize = 10, startAt = null) => {
    const sort = ((asort as firebase.firestore.OrderByDirection) ? asort : 'desc') as firebase.firestore.OrderByDirection;
    return this.firestoreDB.collection('ul_queteur_stats_per_year',
      ref => startAt ?
        ref.orderBy(sortBy, sort).startAfter(startAt).limit(pageSize) :
        ref.orderBy(sortBy, sort).limit(pageSize)
    ).get();
  }

  getAllUlRankingByAmount() {
    return this.firestoreDB.collection('ul_queteur_stats_per_year')
      .get();
  }

  getQueteurStats(queteur_id: string) {
    return this.firestoreDB.collection('ul_queteur_stats_per_year', ref => ref.where('queteur_id', '==', queteur_id))
      .get();
  }

  registerQueteur(userId: string, user: Queteur) {
    return this.firestoreDB.collection('queteurs').doc(userId).set(Object.assign({}, user));
  }

  getStoredQueteur(authId: string): Promise<Queteur> {
    Number(1)
    return this.firestoreDB.firestore
      .collection('queteurs')
      .doc(authId)
      .get()
      .then(doc => doc.data() as Queteur);
  }
}
