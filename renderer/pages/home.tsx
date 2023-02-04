import React, { MouseEventHandler, useEffect, useState } from 'react';

import { NextRouter, useRouter } from 'next/router';
import styled from '@emotion/styled';
import { FlexCenterLayout } from '../components/common/UI/Layout';
import { auth } from '../firebaseConfig';
import ChatRoom from './[id]';
import UserList from '../components/UserList';

function Home() {
  const [isChatRoomCreate, setIsChatRoomCreate] = useState<boolean>(false);
  const [chatMember, setChatMember] = useState([]);

  const router: NextRouter = useRouter();

  const createChatRoom = () => {};

  const handleChatRoomCreate = (id: string) => {
    setIsChatRoomCreate(true);
  };

  return (
    <HomeLayout>
      <MenuLayout>
        <UserList handleChatRoomCreate={handleChatRoomCreate} />
      </MenuLayout>
      <ChatRoomLayout>
        {isChatRoomCreate ? <ChatRoom chatMember={chatMember} /> : <EmptyChatRoom>채팅이 없습니다.</EmptyChatRoom>}
      </ChatRoomLayout>
    </HomeLayout>
  );
}

const HomeLayout = styled(FlexCenterLayout)`
  flex-direction: row;
`;

const MenuLayout = styled.aside`
  flex: 1;
  height: 100vh;
  border-right: 1px solid #e2e2dc;
`;

const ChatRoomLayout = styled.main`
  flex: 28rem;
  height: 100vh;
`;

const EmptyChatRoom = styled(ChatRoomLayout)``;

export default Home;
