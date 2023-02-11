import { addDoc, collection } from 'firebase/firestore';
import { database } from '../../../firebaseConfig';

async function createFirebaseDocument(collectionName: string, initialObject: object) {
  try {
    await addDoc(collection(database, collectionName), initialObject);
  } catch (error) {
    throw new Error(error);
  }
}

export default createFirebaseDocument;
