import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {User} from './model/user';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

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

  registerQueteur(userId: string, user: User) {
    return this.firestoreDB.collection('queteurs').doc(userId).set(Object.assign({}, user));
  }

  getQueteur(authId: string): Promise<User> {
    return this.firestoreDB.firestore
      .collection('queteurs')
      .doc(authId)
      .get()
      .then(doc => doc.data() as User);
  }
}
