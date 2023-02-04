import { type DocumentData } from 'firebase/firestore';

//TODO : Semantic tag
export interface ChatMessageProps extends DocumentData {
  text: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  uid: string;
  name: string;
  id: string;
}
