import { useEffect, useRef, useState } from 'react';
import { auth, database } from '../firebaseConfig';
import {
  addDoc,
  collection,
  DocumentData,
  limit,
  onSnapshot,
  orderBy,
  Query,
  query,
  QuerySnapshot,
  serverTimestamp,
  Unsubscribe,
} from 'firebase/firestore';
import styled from '@emotion/styled';

import { colorPalatte } from './common/UI/color';
import { FlexCenterLayout } from './common/UI/Layout';
import ChatRoomHeader from './ChatRoomHeader';
import ChatMessageInput from './ChatMessageInput';
import type { ChatMessageProps } from '../types/ChatMessageProps';
import type { UserProps } from '../types/UserProps';
import React from 'react';

interface ChatRoomProps {
  chatMemberId: UserProps[];
}

function ChatRoom({ chatMemberId }: ChatRoomProps) {
  const [lastMessage, setLastMessage] = useState<ChatMessageProps[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const uid: string = auth?.currentUser?.uid;
  const messageListBottomRef = useRef<HTMLDivElement>();

  useEffect(() => {
    const chatRoomName: string = chatMemberId.sort().join('');

    const messageQuery: Query<DocumentData> = query(
      collection(database, `message=${chatRoomName}`),
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
  }, [chatMemberId]);

  const createChatRoom = async (): Promise<void> => {
    await addDoc(collection(database, `chatrooms`), {
      name: chatMemberId.sort().join(''),
      createdAt: serverTimestamp(),
      member: chatMemberId,
      own: uid,
    });
  };

  const handleNewMessage = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setNewMessage(e.target.value);
  };

  const sendNewMessage = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    //TODO: when input is none, input is disable function is must do messageInput components

    await addDoc(collection(database, `message=${chatMemberId.sort().join('')}`), {
      text: newMessage,
      createdAt: serverTimestamp(),
      member: chatMemberId,
      own: uid,
    });

    setTimeout(() => {
      messageListBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    createChatRoom();
    setNewMessage('');
  };

  return (
    <>
      <FlexCenterLayout>
        <ChatRoomHeader />
        <ChatRoomMessage>
          {lastMessage.map((it) =>
            it.own === uid ? (
              <>
                <React.Fragment key={it.id}>
                  <ChatBoxWrapper key={it.id}>
                    <ChatBox> {it.text}</ChatBox>
                  </ChatBoxWrapper>
                  <MessageListBottom ref={messageListBottomRef} />
                </React.Fragment>
              </>
            ) : (
              <OtherUserChatBoxWrapper key={it.id}>
                <OtherUserChatBox key={it.id}>{it.text}</OtherUserChatBox>
              </OtherUserChatBoxWrapper>
            )
          )}
        </ChatRoomMessage>
      </FlexCenterLayout>
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
