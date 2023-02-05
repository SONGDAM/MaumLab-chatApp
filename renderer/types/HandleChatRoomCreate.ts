import { MouseEventHandler } from 'react';
import { UserProps } from './UserProps';

export type HandleChatRoomCreate = {
  handleChatRoomCreate: (id: string, currentUser: string) => void;
};
