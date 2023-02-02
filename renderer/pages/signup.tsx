import styled from '@emotion/styled';
import React from 'react';
import { CustomButton } from '../components/common/CustomButton';
import { CustomInput } from '../components/common/CustomInput';
import { Layout } from '../components/common/Layout';
import { Title } from './signIn';

function SignUp() {
  return (
    <SignUpLayout>
      <Title>Join Us</Title>

      <CustomInput placeholder='이름' />
      <CustomInput placeholder='이메일' />
      <CustomInput placeholder='비밀번호' />

      <CustomButton>회원가입하기</CustomButton>
    </SignUpLayout>
  );
}

const SignUpLayout = styled(Layout)`
  gap: 1rem;
`;

export default SignUp;
