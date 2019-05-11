import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';

import {Queteur} from '../../model/queteur';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestoreDB: AngularFirestore) {
  }

  getCount = () => this.firestoreDB.collection('ul_queteur_stats_per_year').get().pipe(map(snap => snap.size));

  select = (dbname: string, sortBy: string, asort = 'desc', pageSize = 10, startAt = null) => {
    const sort = ((asort as firebase.firestore.OrderByDirection) ? asort : 'desc') as firebase.firestore.OrderByDirection;
    return this.firestoreDB.collection(dbname, ref =>
      startAt ? ref.orderBy(sortBy, sort).startAfter(startAt).limit(pageSize) : ref.orderBy(sortBy, sort).limit(pageSize)
    ).get();
  };


  getQueteurStats(queteur_id: string) {
    return this.firestoreDB.collection('ul_queteur_stats_per_year', ref => ref.where('queteur_id', '==', queteur_id))
      .get();
  }

  registerQueteur(userId: string, user: Queteur) {
    return this.firestoreDB
      .collection('queteurs')
      .doc(userId)
      .set(Object.assign({}, user));
  }

  getStoredQueteur(authId: string): Promise<Queteur> {
    return this.firestoreDB.firestore
      .collection('queteurs')
      .doc(authId)
      .get()
      .then(doc => doc.data() as Queteur);
  }

  isQueteurAlreadyRegistered(nivol: string): Promise<Queteur> {
    return this.firestoreDB.firestore
      .collection('queteurs')
      .where('nivol', '==', nivol)
      .get()
      .then(query => {
        if (query.docs.length !== 0) {
          return query.docs[0].data() as Queteur;
        }
        return undefined;
      });
  }
}
