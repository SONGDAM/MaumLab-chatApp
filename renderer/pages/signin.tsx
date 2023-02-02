import styled from '@emotion/styled';
import React from 'react';
import Link from 'next/link';
import { Layout } from '../components/common/Layout';
import { CustomInput } from '../components/common/CustomInput';
import { CustomButton } from '../components/common/CustomButton';

function SignIn() {
  return (
    <SignInLayout>
      <Title>MaumLab-ChatApp</Title>

      <CustomInput placeholder='이메일' />
      <CustomInput placeholder='비밀번호' />

      <CustomButton>로그인</CustomButton>

      <Link href={'/signUp'}>
        <SignUpComment>아직 계정이 없으신가요? 회원가입하기</SignUpComment>
      </Link>
    </SignInLayout>
  );
}

const SignInLayout = styled(Layout)`
  gap: 1rem;
`;

export const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #191919;
  margin-bottom: 2rem;
`;

const SignUpComment = styled.p`
  font-size: 1rem;
  letter-spacing: 0.3;
  line-height: 0.5;
  text-decoration: underline;
  text-underline-offset: 8px;
`;

export default SignIn;
