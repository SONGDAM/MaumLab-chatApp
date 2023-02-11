import { useMemo } from 'react';
import styled from '@emotion/styled';
import Image from 'next/image';

import useGetFirebaseQuery from '../hooks/useGetFirebaseQuery';
import { auth } from '../firebaseConfig';
import { FlexColmunCenter } from './common/UI/Layout';

import type { UserProps } from '../types/UserProps';
import type { GetChatRoomMember } from '../types/HandleChatRoomCreate';

type QueryResult = UserProps[];

function UserList({ getChatRoomMember }: GetChatRoomMember) {
  const uid = auth?.currentUser?.uid;
  const userQueryResult: QueryResult = useGetFirebaseQuery('users', 'name');

  const currentUser = useMemo(() => userQueryResult.find((u) => u.uid === uid), [uid, userQueryResult]);

  return (
    <UserListLayout>
      {userQueryResult
        .filter((user) => user.uid !== uid)
        .map((it) => (
          <UserListItem key={it.uid} onClick={() => getChatRoomMember(it, currentUser)}>
            <Image src={it.profilePicPath} alt='user profile picture' width={50} height={80} quality={80} />
            <UserName>{it.name}</UserName>
          </UserListItem>
        ))}
    </UserListLayout>
  );
}

const UserListLayout = styled(FlexColmunCenter)`
  position: fixed;
  top: 4rem;
  justify-content: flex-start;
`;

const UserListItem = styled.div`
  display: flex;
  justify-content: flex-start;
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
