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

function ChatRoom({ chatMember }) {
  const [lastMessage, setLastMessage] = useState<ChatMessageProps[]>([]);
  const [typedMessage, setTypedMessage] = useState<string>('');

  const uid = auth?.currentUser?.uid;

  useEffect(() => {
    const messageQuery: Query<DocumentData> = query(
      collection(database, `message=${chatRoomName}`),
      orderBy('createdAt'),
      limit(50)
    );

    const unsubscribe: Unsubscribe = onSnapshot(messageQuery, (QuerySnapshot) => {
      const messages = [];

      QuerySnapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });

      setLastMessage(messages);
    });

    return () => unsubscribe();
  }, []);

  const chatRoomName = chatMember.sort().join('');

  // const createChatRoom = async (): Promise<void> => {
  //   console.log(`chatRoom has created`);

  //   await addDoc(collection(database, 'privatechat'), {
  //     name: chatMemeber[0].name,
  //     createdAt: serverTimestamp(),
  //     member: chatMember,
  //     lastMessage: typedMessage,
  //   });
  // };

  const handleMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTypedMessage(e.target.value);
  };

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (typedMessage.trim() === '') {
      Swal.fire({
        icon: 'warning',
        title: '메시지를 입력해주세요',
        timer: 1500,
      });

      return;
    }

    await addDoc(collection(database, `message=${chatRoomName}`), {
      text: typedMessage,
      createdAt: serverTimestamp(),
      member: chatMember,
      own: uid,
    });

    setTypedMessage('');
  };

  const otherUserMessage = lastMessage
    .filter((it) => it.own !== uid)
    .map((it) => <SideChatBox key={it.uid}>{it.text}</SideChatBox>);

  const currentUserMessage = lastMessage
    .filter((it) => it.own === uid)
    .map((it) => <ChatBox key={it.uid}>{it.text}</ChatBox>);

  return (
    <FlexCenterLayout>
      <ChatRoomHeader />

      <ChatRoomMessage>
        <SideChatBoxWrapper>{otherUserMessage}</SideChatBoxWrapper>
        <ChatBoxWrapper>{currentUserMessage}</ChatBoxWrapper>
      </ChatRoomMessage>
      <ChatMessageInput handleMessage={handleMessage} sendMessage={sendMessage} />
    </FlexCenterLayout>
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
