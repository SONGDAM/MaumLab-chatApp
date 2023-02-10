import { UserProps } from './UserProps';

export interface ChatRoomProps {
  member: UserProps[];
  recentMessage: string;
  name: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  own: string;
  profilePicPath: string;
  id: string;
}
