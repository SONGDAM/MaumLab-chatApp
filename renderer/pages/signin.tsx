import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { auth } from '../firebaseConfig';
import { inMemoryPersistence, setPersistence, signInWithEmailAndPassword } from 'firebase/auth';
import { SetterOrUpdater, useRecoilValue, useSetRecoilState } from 'recoil';
import { SignUpProps, UserProps } from '../types/UserProps';

import { FlexCenterLayout } from '../components/common/UI/Layout';
import { CustomInput } from '../components/common/UI/CustomInput';
import { CustomButton } from '../components/common/UI/CustomButton';
import { CustomForm } from '../components/common/UI/CustomForm';
import { ErrorMessage } from '../components/common/UI/ErrorMessage';
import { NextRouter, useRouter } from 'next/router';

function SignIn() {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const router: NextRouter = useRouter();

  // useEffect(() => {
  //   if (userEmail) {
  //     router.push('/home');
  //   }
  // }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpProps>();

  const onSubmit: SubmitHandler<SignUpProps> = async (userCredential) => {
    try {
      await setPersistence(auth, inMemoryPersistence);

      const signInResponse = await signInWithEmailAndPassword(auth, userCredential.email, userCredential.password);

      if (signInResponse) {
        router.push('/home');
      }
    } catch (error) {
      switch (error.code) {
        case 'auth/user-not-found':
          setErrorMessage('유저를 찾을 수 없습니다.');
          break;
        case 'auth/wrong-password':
          setErrorMessage('아이디와 비밀번호를 확인해주세요.');
          break;
      }
    }
  };

  return (
    <SignInLayout>
      <Title>MaumLab-ChatApp</Title>

      <CustomForm onSubmit={handleSubmit(onSubmit)}>
        <CustomInput
          placeholder='이메일'
          {...register('email', {
            required: true,
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: '올바르지 않은 이메일 주소입니다',
            },
          })}
        />

        <CustomInput
          type={'password'}
          placeholder='비밀번호'
          {...register('password', {
            required: true,
            maxLength: 20,
            pattern: {
              value: /^[A-Za-z0-9]{6,12}$/,
              message: '올바르지 않은 비밀번호 구성입니다.',
            },
          })}
        />

        {errors.email && <ErrorMessage>올바르지 않은 이메일 주소입니다.</ErrorMessage>}
        <ErrorMessage>{errorMessage}</ErrorMessage>

        <CustomButton type='submit'>로그인</CustomButton>
      </CustomForm>
      <Link href={'/signup'}>
        <SignUpComment>아직 계정이 없으신가요? 회원가입하기</SignUpComment>
      </Link>
    </SignInLayout>
  );
}

// const SignInLayout = styled(FlexCenterLayout)`
//   gap: 1rem;
// `;

const SignInLayout = styled(FlexCenterLayout)`
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
