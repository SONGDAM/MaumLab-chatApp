import { addDoc, collection } from 'firebase/firestore';
import { database } from '../../../firebaseConfig';

async function createFirebaseDocument(collectionName: string, initialObject: object) {
  await addDoc(collection(database, collectionName), initialObject);

  return;
}

export default createFirebaseDocument;
