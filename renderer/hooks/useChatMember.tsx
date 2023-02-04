import { useState } from 'react';

function useChatMember(...args) {
  const [chatMember, setChatMember] = useState([]);

  const handleChatMember = () => {
    setChatMember([...args]);
  };
}

export default useChatMember;
