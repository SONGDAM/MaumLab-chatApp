import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useForm, SubmitHandler } from 'react-hook-form';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

import { CustomButton } from '../components/common/UI/CustomButton';
import { CustomForm } from '../components/common/UI/CustomForm';
import { CustomInput } from '../components/common/UI/CustomInput';
import { FlexCenterLayout } from '../components/common/UI/Layout';
import { Title } from './signin';
import { ErrorMessage } from '../components/common/UI/ErrorMessage';
import { UserProps } from '../types/UserProps';

function SignUp() {
  const [errorMessage, setErrorMessage] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserProps>();

  const onSubmit: SubmitHandler<UserProps> = async (userCredential) => {
    try {
      await createUserWithEmailAndPassword(auth, userCredential.email, userCredential.password);
    } catch (error) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          setErrorMessage('사용중인 이메일입니다.');
          break;
      }
    }
  };

  return (
    <SignUpLayout>
      <Title>Join Us</Title>

      <CustomForm onSubmit={handleSubmit(onSubmit)}>
        <CustomInput placeholder='이름' {...register('name', { required: true, maxLength: 20 })} />
        {errors.name && <ErrorMessage>이름을 입력해주세요.</ErrorMessage>}

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
        {errors.email && <ErrorMessage>올바르지 않은 이메일 주소입니다.</ErrorMessage>}

        <CustomInput
          placeholder='비밀번호(6~12자리,한 개 이상의 영문자, 숫자로 입력해주세요)'
          {...register('password', {
            required: true,
            maxLength: 20,
            pattern: {
              value: /^[A-Za-z0-9]{6,12}$/,
              message: '올바르지 않은 비밀번호 구성입니다.',
            },
          })}
          type='password'
        />
        {errors.password && <ErrorMessage>올바르지 않은 비밀번호입니다.</ErrorMessage>}

        <ErrorMessage>{errorMessage}</ErrorMessage>

        <CustomButton type='submit'>회원가입하기</CustomButton>
      </CustomForm>
    </SignUpLayout>
  );
}

const SignUpLayout = styled(FlexCenterLayout)`
  gap: 1.4rem;
`;

export default SignUp;
