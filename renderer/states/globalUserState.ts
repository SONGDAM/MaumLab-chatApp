import { atom } from 'recoil';
import { UserProps } from '../types/UserProps';

export const globalUserState = atom<UserProps[]>({
  key: 'userState',
  default: [],
});
