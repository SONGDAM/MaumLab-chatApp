import styled from '@emotion/styled';
import { CustomButton } from './common/UI/CustomButton';
import { CustomForm } from './common/UI/CustomForm';

interface ChatInputProps {
  handleMessage: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  sendMessage: (e: React.FormEvent<HTMLFormElement>) => void;
}

function ChatMessageInput({ handleMessage, sendMessage }: ChatInputProps) {
  return (
    <CustomForm onSubmit={sendMessage}>
      <ChatInputWrapper>
        <ChatInput onChange={handleMessage} />
        <SubmitButton type={'submit'}>전송</SubmitButton>
      </ChatInputWrapper>
    </CustomForm>
  );
}

const ChatInputWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;

const ChatInput = styled.textarea`
  resize: none;
  padding: 12px 12px 0 12px;
  width: 36rem;
  height: 4rem;
  border-radius: 12px;
`;

const SubmitButton = styled(CustomButton)`
  margin-top: 1rem;
  width: 6rem;
  height: 4rem;
`;

export default ChatMessageInput;
