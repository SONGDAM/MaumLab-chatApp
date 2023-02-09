import React, { useEffect, useState } from 'react';
import { NextRouter, useRouter } from 'next/router';
import styled from '@emotion/styled';
import Image from 'next/image';
import { auth } from '../firebaseConfig';
import ChatRoom from '../components/ChatRoom';
import { onAuthStateChanged } from 'firebase/auth';
import UserList from '../components/UserList';
import ChatRoomList from '../components/ChatRoomList';

import User from '../assets/user.svg';
import Logout from '../assets/logout.svg';
import Chat from '../assets/chat.svg';

import { FlexCenter, FlexColmunCenter } from '../components/common/UI/Layout';
import { colorPalatte } from '../components/common/UI/color';
import CustomModal from '../components/common/UI/CustomModal';

function Home() {
  const [chatMember, setChatMember] = useState([]);
  const [isChatRoomListMenu, setIsChatRoomListMenu] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isChatRoomOpen, setIsChatRoomOpen] = useState(false);
  const router: NextRouter = useRouter();
  const uid = auth?.currentUser?.uid;

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/signin');
      }
    });
  }, [router]);

  const getChatRoomMember = (newMember: [], currentMember: []): void => {
    setIsOpen((prev) => !prev);
    setChatMember([newMember, currentMember]);
  };

  const handleTabMenu = (): void => {
    setIsChatRoomListMenu((prev) => !prev);
  };

  const loadChatRoom = (): void => {
    setIsChatRoomOpen(true);
    setIsOpen((prev) => !prev);
  };

  const handleChatRoom = (member): void => {
    setIsChatRoomOpen(true);
    setChatMember(member);
  };

  const handleModal = (): void => {
    setIsOpen((prev) => !prev);
    setIsChatRoomOpen((prev) => !prev);
  };

  const modalUserContent = chatMember
    .filter((it) => it.uid !== uid)
    .map((it) => (
      <ModalUserItem key={it.uid}>
        <Image src={it.profilePicPath} width={60} height={60} />
        <p key={it.uid}>{it?.name}</p>
      </ModalUserItem>
    ));

  const signOut = (): Promise<void> => auth.signOut();

  return (
    <>
      <HomeLayout>
        <MenuLayout>
          {isChatRoomListMenu ? (
            <ChatRoomList chatMember={chatMember} handleChatRoom={handleChatRoom} />
          ) : (
            <UserList getChatRoomMember={getChatRoomMember} />
          )}

          <UserMenuTab>
            {isChatRoomListMenu ? (
              <ChatListButton onClick={handleTabMenu}>
                <Image src={User} alt='show user' width={20} height={20} />
              </ChatListButton>
            ) : (
              <UserListButton onClick={handleTabMenu}>
                <Image src={Chat} alt='show chat list' width={20} height={20} />
              </UserListButton>
            )}
            <SignOutButton onClick={signOut}>
              <Image src={Logout} alt='show chat list' width={20} height={20} />
            </SignOutButton>
          </UserMenuTab>
        </MenuLayout>

        {isChatRoomOpen ? (
          <ChatRoomLayout>
            <ChatRoom chatMember={chatMember} />
          </ChatRoomLayout>
        ) : null}
      </HomeLayout>

      <CustomModal isOpen={isOpen}>
        {modalUserContent}
        <ModalButtonGroup>
          <ChatSubmitButton onClick={loadChatRoom}>채팅하기</ChatSubmitButton>
          <CancelButton onClick={handleModal}>취소하기</CancelButton>
        </ModalButtonGroup>
      </CustomModal>
    </>
  );
}

const HomeLayout = styled(FlexColmunCenter)`
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

const UserMenuTab = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 16.2rem;
  height: 3rem;
  position: fixed;
  bottom: 0;
  background-color: ${colorPalatte.primary};
`;

const UserListButton = styled.button`
  background-color: ${colorPalatte.primary};
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
`;

const ChatListButton = styled(UserListButton)``;

const SignOutButton = styled(UserListButton)``;

const ModalUserItem = styled(FlexCenter)`
  gap: 4rem;
  font-size: 1.6rem;

  img {
    border-radius: 50%;
  }
`;

const ModalButtonGroup = styled(FlexCenter)`
  gap: 2rem;
`;

const ChatSubmitButton = styled.button`
  width: 6rem;
  height: 2.8rem;
  background-color: ${colorPalatte.primary};
  border-radius: 12px;
  color: #fff;
  font-size: 1rem;
`;

const CancelButton = styled(ChatSubmitButton)`
  background-color: #eb455f;
  color: #fff;
`;

export default Home;
