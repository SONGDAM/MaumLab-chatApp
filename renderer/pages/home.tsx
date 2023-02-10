import React, { useCallback, useEffect, useState } from 'react';
import { NextRouter, useRouter } from 'next/router';
import styled from '@emotion/styled';
import Image from 'next/image';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import UserMenuHeader from '../components/UserMenuHeader';
import UserList from '../components/UserList';
import ChatRoom from '../components/ChatRoom';
import ChatRoomList from '../components/ChatRoomList';
import type { UserProps } from '../types/UserProps';

import { FlexCenter, FlexColmunCenter } from '../components/common/UI/Layout';
import CustomModal from '../components/common/UI/CustomModal';
import { colorPalatte } from '../style/color';

import User from '../assets/user.svg';
import Logout from '../assets/logout.svg';
import Chat from '../assets/chat.svg';

function Home() {
  const [chatMember, setChatMember] = useState([]);
  const [isChatRoomListMenu, setIsChatRoomListMenu] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isChatRoomOpen, setIsChatRoomOpen] = useState(false);
  const [isCreateGroupChat, setIsCreateGroupChat] = useState(false);
  const router: NextRouter = useRouter();
  const uid = auth?.currentUser?.uid;

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/signin');
      }
    });
  }, [router]);

  const getChatRoomMember = useCallback(
    (member: UserProps, currentUser: UserProps): void => {
      isCreateGroupChat ? null : setIsOpen((prev) => !prev);

      setChatMember((prev) => {
        const members = new Set(prev);

        members.add(member);
        members.add(currentUser);

        return Array.from(members);
      });
    },
    [isCreateGroupChat]
  );

  const getChatRoom = useCallback((member): void => {
    setIsChatRoomOpen(true);

    setChatMember((prev) => {
      const members = new Set(prev);

      members.add(member);

      return Array.from(members).flat();
    });
  }, []);

  const loadChatRoom = (): void => {
    setIsChatRoomOpen(true);
    setIsOpen((prev) => !prev);
  };

  const handleGroupChatRoom = () => {
    setIsChatRoomOpen(true);
    setIsCreateGroupChat(false);
  };

  const handleCreateGroupChat = (): void => {
    setIsCreateGroupChat(false);
  };

  const handleTabMenu = (): void => {
    setChatMember([]);
    setIsChatRoomListMenu((prev) => !prev);
  };

  const handleModal = (): void => {
    setIsOpen((prev) => !prev);
    setIsChatRoomOpen(false);
    setChatMember([]);
  };

  const signOut = (): Promise<void> => auth.signOut();

  const groupChatMemberName = chatMember.length >= 3 ? chatMember.map((it) => it.name).join(',') : null;

  const modalUserContent = chatMember
    .filter((it) => it.uid !== uid)
    .map((it) => (
      <ModalUserItem key={it.uid}>
        <Image src={it.profilePicPath} width={60} height={60} />
        <p key={it.uid}>{it?.name}</p>
      </ModalUserItem>
    ));

  console.log(chatMember);

  return (
    <>
      <HomeLayout>
        <MenuLayout>
          <UserMenuHeader handleCreateGroupChat={handleCreateGroupChat} isChatRoomListMenu={isChatRoomListMenu} />
          {isCreateGroupChat && (
            <GroupChatUserBox>
              {groupChatMemberName}
              <GroupChatButtonWrapper>
                <GroupChatSubmitButton onClick={handleGroupChatRoom}>추가</GroupChatSubmitButton>
                <GroupChatCancelButton onClick={handleCreateGroupChat}>취소</GroupChatCancelButton>
              </GroupChatButtonWrapper>
            </GroupChatUserBox>
          )}

          <UserMenuTab>
            {isChatRoomListMenu ? (
              <>
                <ChatRoomList getChatRoom={getChatRoom} />
                <ChatListButton onClick={handleTabMenu}>
                  <Image src={User} alt='show user' width={20} height={20} />
                </ChatListButton>
              </>
            ) : (
              <>
                <UserList getChatRoomMember={getChatRoomMember} />
                <UserListButton onClick={handleTabMenu}>
                  <Image src={Chat} alt='show chat list' width={20} height={20} />
                </UserListButton>
              </>
            )}
            <SignOutButton onClick={signOut}>
              <Image src={Logout} alt='show chat list' width={20} height={20} />
            </SignOutButton>
          </UserMenuTab>
        </MenuLayout>

        {isChatRoomOpen && (
          <ChatRoomLayout>
            <ChatRoom chatMember={chatMember} />
          </ChatRoomLayout>
        )}
      </HomeLayout>

      {chatMember.length === 2 ? (
        <CustomModal isOpen={isOpen}>
          {modalUserContent}
          <ModalButtonGroup>
            <ChatSubmitButton onClick={loadChatRoom}>채팅하기</ChatSubmitButton>
            <CancelButton onClick={handleModal}>취소하기</CancelButton>
          </ModalButtonGroup>
        </CustomModal>
      ) : null}
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

const GroupChatUserBox = styled(FlexCenter)`
  flex-wrap: wrap;
  position: absolute;
  top: 0;
  left: 16rem;
  width: 16.6rem;
  height: 12rem;
  padding: 2.2rem 0 1rem 0;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
  z-index: 1;
`;

const GroupChatButtonWrapper = styled(FlexCenter)`
  gap: 1rem;
`;

const GroupChatSubmitButton = styled.button`
  align-self: flex-end;
  margin-bottom: 1rem;
  background-color: ${colorPalatte.primary};
  width: 4rem;
  height: 2.6rem;
  border-radius: 12px;
  color: #fff;
`;

const GroupChatCancelButton = styled(GroupChatSubmitButton)`
  background-color: #eb455f;
  color: #fff;
`;

const UserMenuTab = styled(FlexCenter)`
  justify-content: space-between;
  width: 16.6rem;
  height: 3rem;
  position: fixed;
  bottom: 0;
  background-color: ${colorPalatte.primary};
`;

const ChatRoomLayout = styled.main`
  flex: 28rem;
  height: 100vh;
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
