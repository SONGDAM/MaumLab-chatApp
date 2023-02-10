import React, { useState } from 'react';
import Image from 'next/image';
import styled from '@emotion/styled';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  setPersistence,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth, database } from '../firebaseConfig';
import Swal from 'sweetalert2';

import { CustomButton } from '../components/common/UI/CustomButton';
import { CustomForm } from '../components/common/UI/CustomForm';
import { CustomInput } from '../components/common/UI/CustomInput';
import { FlexColmunCenter } from '../components/common/UI/Layout';
import { Title } from './signin';
import { ErrorMessage } from '../components/common/UI/ErrorMessage';
import { SignUpProps } from '../types/UserProps';
import { addDoc, collection } from 'firebase/firestore';
import { NextRouter, useRouter } from 'next/router';
import Back from '../assets/left-arrow.svg';
import createFirebaseDocument from '../components/common/util/createFirebaseDocument';

function SignUp() {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const router: NextRouter = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpProps>();

  const onSubmit: SubmitHandler<SignUpProps> = async (userCredential) => {
    try {
      const signUpResponse = await createUserWithEmailAndPassword(auth, userCredential.email, userCredential.password);

      createFirebaseDocument('users', {
        name: userCredential.name,
        email: userCredential.email,
        profilePicPath: 'https://api.lorem.space/image/face?w=150&h=220',
        uid: signUpResponse.user.uid,
      });

      await setPersistence(auth, browserLocalPersistence);

      await signInWithEmailAndPassword(auth, userCredential.email, userCredential.password);

      const signUpSuccessModal = await Swal.fire({
        icon: 'success',
        title: '회원가입이 완료되었습니다',
        showConfirmButton: true,
      });

      if (signUpSuccessModal.isConfirmed) {
        router.push('/home');
      }
    } catch (error) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          setErrorMessage('사용중인 이메일입니다.');
          return;
      }
    }
  };

  const goback = () => {
    router.back();
  };

  return (
    <>
      <NavigationBar>
        <GoBackButton onClick={goback}>
          <Image src={Back} width={22} height={22} alt='go back button' />
        </GoBackButton>
      </NavigationBar>

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
    </>
  );
}

const NavigationBar = styled.header`
  height: 22px;
  position: fixed;
  top: 18px;
  left: 12px;
`;

const GoBackButton = styled.button`
  border: none;
  background-color: #fff;
`;

const SignUpLayout = styled(FlexColmunCenter)`
  gap: 1.4rem;
  overflow-y: hidden;
`;

export default SignUp;
