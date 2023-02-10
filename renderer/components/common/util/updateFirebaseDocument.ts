import { setDoc, doc } from 'firebase/firestore';
import { database } from '../../../firebaseConfig';

async function updateFirebaseDocument(collectionName: string, field: string, initialObject: object) {
  await setDoc(doc(database, collectionName, field), initialObject);

  return;
}

export default updateFirebaseDocument;
