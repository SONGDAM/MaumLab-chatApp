import {
  collection,
  DocumentData,
  limit,
  onSnapshot,
  orderBy,
  query,
  Query,
  QuerySnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { database } from '../firebaseConfig';

function useGetFirebaseQuery(collectionName: string, classify: string) {
  const [queryResult, setQueryResult] = useState([]);

  useEffect(() => {
    const userQuery: Query<DocumentData> = query(collection(database, collectionName), orderBy(classify), limit(50));

    const unsubscribe: Unsubscribe = onSnapshot(userQuery, (QuerySnapshot: QuerySnapshot) => {
      const result = [];

      QuerySnapshot.forEach((doc) => {
        result.push({ ...doc.data(), id: doc.id });
      });

      setQueryResult(result);
    });

    return () => {
      unsubscribe();
    };
  }, [collectionName, classify]);

  return queryResult;
}

export default useGetFirebaseQuery;
