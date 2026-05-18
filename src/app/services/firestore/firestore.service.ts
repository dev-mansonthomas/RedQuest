import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';

import {Queteur} from '../../model/queteur';

import 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestoreDB: AngularFirestore) {
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
    return new Promise<Queteur>(resolve => {
      if (nivol) {
        this.firestoreDB.firestore
          .collection('queteurs')
          .where('nivol', '==', nivol.toUpperCase())
          .get()
          .then(query => {
            if (query.docs.length !== 0) {
              resolve(query.docs[0].data() as Queteur);
            }
            resolve(undefined);
          });
      } else {
        resolve(undefined);
      }
    });
  }
}
