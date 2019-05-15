import {Injectable} from '@angular/core';
import {AngularFirestore, QueryDocumentSnapshot, QuerySnapshot} from '@angular/fire/firestore';

import {Queteur} from '../../model/queteur';
import {UlRankingByAmount} from '../../model/UlRankingByAmount';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestoreDB: AngularFirestore) {
  }

  selectUlStats = (dbname: string,
                   sortBy: string,
                   ul: number,
                   year: number,
                   asort = 'desc',
                   pageSize = 10,
                   startAt = null) => {
    const sort = ((asort as firebase.firestore.OrderByDirection) ? asort : 'desc') as firebase.firestore.OrderByDirection;
    return this.firestoreDB.collection(dbname, ref => {
        let query = ref
          .where('ul_id', '==', ul)
          .where('year', '==', year)
          .orderBy(sortBy, sort);
        if (startAt) {
          query = query.startAfter(startAt);
        }
        return query.limit(pageSize);
      }
    ).get();
  };


  getQueteurStats(queteur_id: string) {
    return this.firestoreDB.collection('ul_queteur_stats_per_year', ref => ref.where('queteur_id', '==', queteur_id))
      .get();
  }

  getUlStatsOrderedBy(orderBy: string, sortDirection: 'desc' | 'asc', ul_id: number, year: number): Observable<QuerySnapshot> {
    return this.firestoreDB.collection('ul_queteur_stats_per_year',
      ref => ref.where('ul_id', '==', ul_id)
        .where('year', '==', year)
        .orderBy(orderBy, sortDirection)
    ).get();
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
