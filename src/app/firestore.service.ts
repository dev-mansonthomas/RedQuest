import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {User} from './model/user';
import {AuthService} from './auth.service';

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

  registerQueteur(userId: string, user: User) {
    return this.firestoreDB.collection('queteurs').doc(userId).set(Object.assign({}, user));
  }

  getQueteur(): Promise<User> {
    return new Promise<User>((resolve) => {
      const user = this.authService.getConnectedUser();
      if (user) {
        this.getQueteurFromFirestore(this.authService.getConnectedUser().uid).then(queteur => resolve(queteur));
      } else {
        this.authService.onUserConnected().subscribe(
          connectedUser => this.getQueteurFromFirestore(connectedUser.uid).then(queteur => resolve(queteur))
        );
      }
    });
  }

  private getQueteurFromFirestore(authId: string): Promise<User> {
    return this.firestoreDB.firestore
      .collection('queteurs')
      .doc(authId)
      .get()
      .then(doc => doc.data() as User);
  }
}
