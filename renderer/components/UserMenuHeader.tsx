import Image from 'next/image';
import styled from '@emotion/styled';
import Add from '../assets/add.svg';
import { FlexCenter } from './common/UI/Layout';

interface UserMenuHeaderProps {
  handleCreateGroupChat: () => void;
  isChatRoomListMenu: boolean;
}

function UserMenuHeader({ handleCreateGroupChat, isChatRoomListMenu }: UserMenuHeaderProps) {
  return (
    <UserMenuHeaderWrapper>
      <Title>{isChatRoomListMenu ? '채팅' : '친구'}</Title>
      <CreateGroupChatButton onClick={handleCreateGroupChat}>
        <Image src={Add} width={20} height={20} />
        그룹채팅하기
      </CreateGroupChatButton>
    </UserMenuHeaderWrapper>
  );
}

const Title = styled.h2`
  margin-bottom: 0.4rem;
  padding: 1rem 0 1rem 1rem;
  font-size: 1.2rem;
  font-weight: 700;
  border-width: 18rem;
  border-bottom: 1px solid #e0e0e0;
`;

const UserMenuHeaderWrapper = styled(FlexCenter)`
  justify-content: center;
  width: 16.6rem;
  padding: 0 1rem 0 1rem;
  gap: 4rem;
  font-size: 1rem;
`;

const CreateGroupChatButton = styled(FlexCenter)`
  background-color: #fff;
`;

export default UserMenuHeader;
