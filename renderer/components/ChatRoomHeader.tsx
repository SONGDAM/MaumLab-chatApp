import styled from '@emotion/styled';
import React from 'react';
import { colorPalatte } from './common/UI/color';

function ChatRoomHeader({ chatMember }) {
  return <ChatRoomHeaderWrapper>ChatRoomHeader</ChatRoomHeaderWrapper>;
}

const ChatRoomHeaderWrapper = styled.header`
  flex: 1;
  padding: 1rem 0 0 1rem;
  width: 46rem;
  background-color: ${colorPalatte.primary};
  color: #fff;
  border-bottom: 0.8px #fff solid;
`;

export default ChatRoomHeader;
