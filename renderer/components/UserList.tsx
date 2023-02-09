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

import { type getChatRoomMember } from '../types/HandleChatRoomCreate';
import Image from 'next/image';
import { auth, database } from '../firebaseConfig';
import { FlexColmunCenter } from './common/UI/Layout';
import { onAuthStateChanged } from 'firebase/auth';
import { UserProps } from '../types/UserProps';

import React from 'react';

function UserList({ getChatRoomMember }: getChatRoomMember) {
  const [userList, setUserList] = useState<UserProps[]>([]);
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

      setUserList(users);
    });

    return () => {
      unsubscribe();
    };
  }, [uid]);

  const currentUser = userList.find((u) => u.uid === uid);

  return (
    <>
      <Title>친구</Title>

      <UserListLayout>
        {userList
          .filter((user) => user.uid !== uid)
          .map((it) => (
            <React.Fragment key={it.uid}>
              <UserListItem onClick={() => getChatRoomMember(it, currentUser)}>
                <Image src={it.profilePicPath} alt='user profile picture' width={50} height={80} quality={80} />
                <UserName>{it.name}</UserName>
              </UserListItem>
            </React.Fragment>
          ))}
      </UserListLayout>
    </>
  );
}

const UserListLayout = styled(FlexColmunCenter)`
  position: fixed;
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
  padding: 1rem 0 1rem 2rem;
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
