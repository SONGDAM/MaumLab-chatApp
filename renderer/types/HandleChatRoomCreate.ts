import { UserProps } from './UserProps';

export type GetChatRoomMember = {
  getChatRoomMember: (newMemeber: UserProps, currentUser: UserProps) => void;
};
