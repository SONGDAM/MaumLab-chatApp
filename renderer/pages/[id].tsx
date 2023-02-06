import { useEffect, useState } from 'react';
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
import Swal from 'sweetalert2';

import { colorPalatte } from '../components/common/UI/color';
import { FlexCenterLayout } from '../components/common/UI/Layout';
import ChatRoomHeader from '../components/ChatRoomHeader';
import ChatMessageInput from '../components/ChatMessageInput';
import { ChatMessageProps } from '../types/ChatMessageProps';
import { UserProps } from '../types/UserProps';

interface ChatRoomProps {
  chatMember: UserProps[];
}

function ChatRoom({ chatMember }: ChatRoomProps) {
  const [lastMessage, setLastMessage] = useState<ChatMessageProps[]>([]);
  const [typedMessage, setTypedMessage] = useState<string>('');

  const uid = auth?.currentUser?.uid;

  useEffect(() => {
    const chatRoomName: string = chatMember.sort().join('');

    console.log(`chatRoomName`, chatRoomName);

    const messageQuery: Query<DocumentData> = query(
      collection(database, `message=${chatRoomName}`),
      orderBy('createdAt'),
      limit(50)
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

  const handleMessage = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setTypedMessage(e.target.value);
  };

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    console.log(typedMessage);

    if (typedMessage.trim() === '') {
      Swal.fire({
        icon: 'warning',
        title: '메시지를 입력해주세요',
        timer: 1500,
      });

      return;
    }

    await addDoc(collection(database, `message=${chatMember.sort().join('')}`), {
      text: typedMessage,
      createdAt: serverTimestamp(),
      member: chatMember,
      own: uid,
    });

    setTypedMessage('');
  };

  const otherUserMessage = lastMessage
    .filter((it) => it.own !== uid)
    .map((it) => <SideChatBox key={it.id}>{it.text}</SideChatBox>);

  const currentUserMessage = lastMessage
    .filter((it) => it.own === uid)
    .map((it) => <ChatBox key={it.id}>{it.text}</ChatBox>);

  console.log(`chatMember`, chatMember);
  console.log(`chatMember`, chatMember);
  console.log(`otherUserMessage`, otherUserMessage);
  console.log(`currentUserMessage`, currentUserMessage);

  return (
    <>
      <FlexCenterLayout>
        <ChatRoomHeader />

        <ChatRoomMessage>
          <SideChatBoxWrapper>{otherUserMessage}</SideChatBoxWrapper>
          <ChatBoxWrapper>{currentUserMessage}</ChatBoxWrapper>
        </ChatRoomMessage>
        <ChatMessageInput handleMessage={handleMessage} sendMessage={sendMessage} />
      </FlexCenterLayout>
    </>
  );
}

const ChatRoomMessage = styled.div`
  width: 46rem;
  padding: 1rem 1rem 1rem;
  display: flex;
  flex-flow: row wrap;
  flex: 24rem;
  justify-content: space-between;
  align-items: flex-start;
  background-color: ${colorPalatte.primary};
  overflow: scroll;
`;

const ChatBoxWrapper = styled.div``;

const SideChatBoxWrapper = styled.div`
  padding-top: 1.68rem;
`;

const ChatBox = styled.div`
  margin-bottom: 1rem;
  padding: 0.4rem 0.625rem 1.4rem 0.625rem;
  width: fit-content;
  height: 2rem;
  background-color: #fff;
  color: #191919;
  border-radius: 12px;
  font-weight: 300;
`;

const SideChatBox = styled(ChatBox)`
  background-color: #6c89cc;
  color: #fff;
`;

export default ChatRoom;
