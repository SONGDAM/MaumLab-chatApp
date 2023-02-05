import React, { MouseEventHandler, useEffect, useState } from 'react';

import { NextRouter, useRouter } from 'next/router';
import styled from '@emotion/styled';
import { FlexCenterLayout } from '../components/common/UI/Layout';
import { auth, database } from '../firebaseConfig';
import ChatRoom from './[id]';
import UserList from '../components/UserList';
// import { addDoc, collection } from 'firebase/firestore';
// import { useRecoilValue } from 'recoil';
// import { globalUserState } from '../states/globalUserState';
// import { UserProps } from '../types/UserProps';
import { onAuthStateChanged } from 'firebase/auth';

function Home() {
  const [isChatRoomCreate, setIsChatRoomCreate] = useState<boolean>(false);
  const [chatMember, setChatMember] = useState([]);

  const router: NextRouter = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/signin');
      }
    });
  }, []);

  const handleChatRoomCreate = (id: string, currentMember: string): void => {
    setIsChatRoomCreate(true);
    setChatMember([id, currentMember]);
  };

  const signOut = () => auth.signOut();

  return (
    <HomeLayout>
      <MenuLayout>
        <UserList handleChatRoomCreate={handleChatRoomCreate} />
        <UserMenu>
          <SignOutButton onClick={signOut}>logout</SignOutButton>
        </UserMenu>
      </MenuLayout>
      <ChatRoomLayout>
        <ChatRoom chatMember={chatMember} />
      </ChatRoomLayout>
    </HomeLayout>
  );
}

const HomeLayout = styled(FlexCenterLayout)`
  flex-flow: row nowrap;
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

const UserMenu = styled.div`
  flex: row;
  justify-content: space-between;
  position: fixed;
  bottom: 0;
`;

const SignOutButton = styled.button`
  background-color: pink;
`;

export default Home;
