import Image from 'next/image';
import styled from '@emotion/styled';
import { auth } from '../firebaseConfig';
import { FlexCenter, FlexColmunCenter } from './common/UI/Layout';
import useGetFirebaseQuery from '../hooks/useGetFirebaseQuery';
import { ChatRoomProps } from '../types/ChatRoomProps';

interface ChatRoomListProps {
  getChatRoom: (chatMembers) => void;
}

function ChatRoomList({ getChatRoom }: ChatRoomListProps) {
  const uid = auth?.currentUser?.uid;
  const chatListQueryResult: ChatRoomProps[] = useGetFirebaseQuery(`chatrooms`, 'name');
  const chatRooms = chatListQueryResult.map((it) => it);

  const myRooms = chatRooms.filter((it) => {
    return it.member.some((member) => member.uid === uid);
  });

  return (
    <UserListLayout>
      {myRooms.map((it) => (
        <ChatRoomListItem key={it.id} onClick={() => getChatRoom(it.member)}>
          <Image src={it.profilePicPath} alt='chat room profile' width={50} height={50} key={it.id} />
          <MemberName>{it.name}</MemberName>
        </ChatRoomListItem>
      ))}
    </UserListLayout>
  );
}

const UserListLayout = styled(FlexColmunCenter)`
  position: fixed;
  top: 4rem;
  justify-content: flex-start;
`;

const ChatRoomListItem = styled(FlexCenter)`
  flex-wrap: nowrap;
  font-size: 1rem;
  padding: 1rem 1rem 1rem 2rem;
  gap: 2rem;
  width: 16rem;
  height: 5rem;
  border-bottom: 1px solid #e0e0e0;

  img {
    border-radius: 50%;
  }
`;

const MemberName = styled.div`
  padding-top: 0.8rem;
`;

export default ChatRoomList;
