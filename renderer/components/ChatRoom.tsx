import React, { useEffect, useRef, useState } from 'react';
import { auth, database } from '../firebaseConfig';
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  limit,
  onSnapshot,
  orderBy,
  Query,
  query,
  QuerySnapshot,
  serverTimestamp,
  setDoc,
  Unsubscribe,
} from 'firebase/firestore';
import styled from '@emotion/styled';

import { colorPalatte } from './common/UI/color';
import { FlexColmunCenter } from './common/UI/Layout';
import ChatRoomHeader from './ChatRoomHeader';
import ChatMessageInput from './ChatMessageInput';
import type { ChatMessageProps } from '../types/ChatMessageProps';
import type { UserProps } from '../types/UserProps';

interface ChatRoomProps {
  chatMember: UserProps[];
}

function ChatRoom({ chatMember }: ChatRoomProps) {
  const [lastMessage, setLastMessage] = useState<ChatMessageProps[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const uid: string = auth?.currentUser?.uid;
  const messageListBottomRef = useRef<HTMLDivElement>();
  const chatRoomDatabaseName: string = chatMember
    .map((it) => it.uid)
    .sort()
    .join('');

  const chatRoomMemberName: string = chatMember
    .map((it) => it.name)
    .sort()
    .join(',');

  useEffect(() => {
    const chatRoomDatabaseName: string = chatMember
      .map((it) => it.uid)
      .sort()
      .join('');

    const messageQuery: Query<DocumentData> = query(
      collection(database, `message=${chatRoomDatabaseName}`),
      orderBy('createdAt'),
      limit(100)
    );

    const unsubscribe: Unsubscribe = onSnapshot(messageQuery, (QuerySnapshot: QuerySnapshot) => {
      const messages = [];

      QuerySnapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });

      setLastMessage(messages);
    });

    return () => unsubscribe();
  }, [chatMember]);

  const createChatRoom = async (): Promise<void> => {
    await setDoc(doc(database, `chatrooms`, chatRoomDatabaseName), {
      profilePicPath: chatMember[0].profilePicPath,
      name: chatRoomMemberName,
      createdAt: serverTimestamp(),
      member: chatMember,
      own: uid,
    });
  };

  const handleNewMessage = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setNewMessage(e.target.value);
  };

  const sendNewMessage = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    await addDoc(collection(database, `message=${chatRoomDatabaseName}`), {
      text: newMessage,
      createdAt: serverTimestamp(),
      memberName: chatRoomMemberName,
      member: chatMember,
      own: uid,
    });

    createChatRoom();

    setTimeout(() => {
      messageListBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    setNewMessage('');
  };

  return (
    <>
      <FlexColmunCenter>
        <ChatRoomHeader chatMember={chatMember} />
        <ChatRoomMessage>
          {lastMessage.map((it) =>
            it.own === uid ? (
              <React.Fragment key={it.id}>
                <ChatBoxWrapper key={it.id}>
                  <ChatBox> {it.text}</ChatBox>
                </ChatBoxWrapper>
                <MessageListBottom ref={messageListBottomRef} />
              </React.Fragment>
            ) : (
              <OtherUserChatBoxWrapper key={it.id}>
                <OtherUserChatBox key={it.id}>{it.text}</OtherUserChatBox>
              </OtherUserChatBoxWrapper>
            )
          )}
        </ChatRoomMessage>
      </FlexColmunCenter>
      <ChatMessageInput handleNewMessage={handleNewMessage} newMessage={newMessage} sendNewMessage={sendNewMessage} />
    </>
  );
}

//TODO: Semantic Tag update

const ChatRoomMessage = styled.div`
  width: 46rem;
  padding: 1rem 1rem 2rem 1.2rem;
  flex: 24rem;
  flex-wrap: wrap;
  align-items: flex-start;
  background-color: ${colorPalatte.primary};
  overflow: scroll;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ChatBoxWrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-end;
  align-items: flex-end;
`;

const OtherUserChatBoxWrapper = styled.div`
  justify-content: flex-start;
  align-items: flex-start;
`;

const ChatBox = styled.div`
  margin-bottom: 8px;
  padding: 0.4rem 0.625rem 1.4rem 0.625rem;
  width: fit-content;
  height: 2rem;
  background-color: #fff;
  color: #191919;
  border-radius: 12px;
  font-weight: 300;
`;

const OtherUserChatBox = styled(ChatBox)`
  background-color: #6c89cc;
  color: #fff;
`;

const MessageListBottom = styled.div`
  margin-bottom: 12px;
`;

export default ChatRoom;
