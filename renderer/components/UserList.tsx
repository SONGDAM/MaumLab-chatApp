import styled from '@emotion/styled';
import {
  collection,
  DocumentData,
  limit,
  onSnapshot,
  orderBy,
  Query,
  query,
  QuerySnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { type HandleChatRoomCreate } from '../types/HandleChatRoomCreate';
import Image from 'next/image';
import { auth, database } from '../firebaseConfig';
import { FlexCenterLayout } from './common/UI/Layout';
import { onAuthStateChanged } from 'firebase/auth';
import { UserProps } from '../types/UserProps';

function UserList({ handleChatRoomCreate }: HandleChatRoomCreate) {
  const [userList, setUserList] = useState<Array<UserProps>>([]);

  const uid = auth?.currentUser?.uid;

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
      }
    });
  }, []);

  useEffect(() => {
    const userQuery: Query<DocumentData> = query(collection(database, 'users'), orderBy('name'), limit(50));

    const unsubscribe: Unsubscribe = onSnapshot(userQuery, (QuerySnapshot: QuerySnapshot) => {
      const users = [];

      QuerySnapshot.forEach((doc) => {
        users.push({ ...doc.data(), id: doc.id });
      });

      const filteredUserList = users.filter((it) => it.uid !== uid);

      setUserList(filteredUserList);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      <Title>친구</Title>

      <UserListLayout>
        {userList.map((it) => (
          <UserListItem key={it.id} onClick={() => handleChatRoomCreate(it.uid, uid)}>
            <Image src={it.profilePicPath} alt='user profile picture' width={50} height={80} quality={80} />
            <UserName>{it.name}</UserName>
          </UserListItem>
        ))}
      </UserListLayout>
    </>
  );
}

const UserListLayout = styled(FlexCenterLayout)`
  justify-content: flex-start;
  overflow-y: scroll;
`;

const Title = styled.h2`
  margin-bottom: 0.4rem;
  padding: 1rem 0 1rem 1rem;
  font-size: 1.2rem;
  font-weight: 700;
  border-bottom: 1px solid #e0e0e0;
`;

const UserListItem = styled.div`
  display: flex;
  gap: 4rem;
  padding: 1rem 2rem 1rem 2rem;
  width: 16rem;
  height: 5rem;
  border-bottom: 1px solid #e0e0e0;

  font-size: 1rem;

  img {
    border-radius: 50%;
  }
`;

const UserName = styled.div`
  padding-top: 0.8rem;
`;

export default UserList;
