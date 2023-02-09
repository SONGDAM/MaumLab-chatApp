import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styled from '@emotion/styled';
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
import { auth, database } from '../firebaseConfig';
import type { UserProps } from '../types/UserProps';

interface ChatRoomListProps {
  chatMember: UserProps[];
  handleChatRoom: (...chatMembers) => void;
}

function ChatRoomList({ chatMember, handleChatRoom }: ChatRoomListProps) {
  const [chatRoomList, setChatRoomList] = useState([]);
  const uid = auth?.currentUser?.uid;

  useEffect(() => {
    const chatListQuery: Query<DocumentData> = query(collection(database, `chatrooms`), orderBy('name'), limit(50));

    const unsubscribe: Unsubscribe = onSnapshot(chatListQuery, (QuerySnapshot: QuerySnapshot) => {
      const chatRooms = [];

      QuerySnapshot.forEach((doc) => {
        chatRooms.push({ ...doc.data(), id: doc.id });
      });

      setChatRoomList(chatRooms);
    });

    return () => unsubscribe();
  }, []);

  console.log(chatMember);

  return (
    <>
      <Title>채팅</Title>

      {chatRoomList
        .filter((it) => it.own === uid)
        .map((it) => (
          <ChatRoomListItem key={it.uid} onClick={() => handleChatRoom(it.member)}>
            <Image src={it.profilePicPath} alt='chat room profile' width={50} height={50} key={it.uid} />
            <MemberName>{it.name}</MemberName>
            <LastMessage>{it.recentMessage}</LastMessage>
          </ChatRoomListItem>
        ))}
    </>
  );
}

const Title = styled.h2`
  margin-bottom: 0.4rem;
  padding: 1rem 0 1rem 1rem;
  font-size: 1.2rem;
  font-weight: 700;
  border-bottom: 1px solid #e0e0e0;
`;

const ChatRoomListItem = styled.div`
  display: flex;
  gap: 3rem;
  width: 17rem;
  padding: 1rem 0 1rem 2rem;
  height: 5rem;
  border-bottom: 1px solid #e0e0e0;

  font-size: 1rem;

  img {
    border-radius: 50%;
  }
`;

const MemberName = styled.div`
  padding-top: 0.8rem;
`;

const LastMessage = styled.p``;

export default ChatRoomList;
