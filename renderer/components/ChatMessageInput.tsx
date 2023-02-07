import styled from '@emotion/styled';
import { CustomButton } from './common/UI/CustomButton';
import { CustomForm } from './common/UI/CustomForm';

interface ChatInputProps {
  handleNewMessage: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  sendNewMessage: (e: React.FormEvent<HTMLFormElement>) => void;
  newMessage: string;
}

function ChatMessageInput({ handleNewMessage, sendNewMessage, newMessage }: ChatInputProps) {
  return (
    <ChatMessageInputForm onSubmit={sendNewMessage} defaultValue={''}>
      <ChatInputWrapper>
        <ChatInput onChange={handleNewMessage} value={newMessage} />
        <SubmitButton type={'submit'} disabled={!newMessage}>
          전송
        </SubmitButton>
      </ChatInputWrapper>
    </ChatMessageInputForm>
  );
}

const ChatMessageInputForm = styled(CustomForm)`
  position: fixed;
  /* bottom: 0.2rem; */
  bottom: 0;
`;

const ChatInputWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  background-color: #fff;
  width: 46rem;
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
