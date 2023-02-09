import styled from '@emotion/styled';
import { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { FlexCenter } from './Layout';

interface ModalProps {
  children: ReactNode;
  isOpen: boolean;
}

function CustomModal({ children, isOpen }: ModalProps) {
  console.log('component has mount');

  return (
    <>
      {isOpen &&
        createPortal(
          <>
            <ModalOverlay>
              <ModalWrapper>{children}</ModalWrapper>
            </ModalOverlay>
          </>,
          document.querySelector('#modal') as HTMLDivElement
        )}
    </>
  );
}

const ModalOverlay = styled(FlexCenter)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 1;
`;

const ModalWrapper = styled(FlexCenter)`
  flex-direction: column;
  gap: 4rem;
  background-color: #fff;
  width: 34rem;
  height: 16rem;
  border-radius: 12px;
`;

export default CustomModal;
