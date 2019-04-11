import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Queteur} from '../../model/queteur';
import {AuthService} from '../auth/auth.service';

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

  getAllUlRankingByAmount() {
    return this.firestoreDB.collection('ul_queteur_stats_per_year')
      .get();
  }

  registerQueteur(userId: string, user: Queteur) {
    return this.firestoreDB.collection('queteurs').doc(userId).set(Object.assign({}, user));
  }

  getStoredQueteur(authId: string): Promise<Queteur> {
    return this.firestoreDB.firestore
      .collection('queteurs')
      .doc(authId)
      .get()
      .then(doc => doc.data() as Queteur);
  }
}
