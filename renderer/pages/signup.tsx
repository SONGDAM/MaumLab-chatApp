import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  setPersistence,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../firebaseConfig';
import createFirebaseDocument from '../components/common/util/createFirebaseDocument';
import useInputValidation from '../hooks/useInputValidation';
import Swal from 'sweetalert2';

import { CustomButton } from '../components/common/UI/CustomButton';
import { CustomForm } from '../components/common/UI/CustomForm';
import { CustomInput } from '../components/common/UI/CustomInput';
import { FlexColmunCenter } from '../components/common/UI/Layout';
import { Title } from './signin';
import { ErrorMessage } from '../components/common/UI/ErrorMessage';
import Back from '../assets/left-arrow.svg';

function SignUp() {
  const [errorMessage, setErrorMessage, handleChange, formData] = useInputValidation(
    {
      name: '',
      email: '',
      password: '',
    },
    true
  );

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      const signUpResponse = await createUserWithEmailAndPassword(auth, formData.email, formData.password);

      createFirebaseDocument('users', {
        name: formData.name,
        email: formData.email,
        profilePicPath: 'https://api.lorem.space/image/face?w=150&h=220',
        uid: signUpResponse.user.uid,
      });

      await setPersistence(auth, browserLocalPersistence);

      await signInWithEmailAndPassword(auth, formData.email, formData.password);

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

        <CustomForm onSubmit={handleSubmit}>
          <CustomInput placeholder='이름' name='name' value={formData.name} onChange={handleChange} />

          <CustomInput placeholder='이메일' name='email' value={formData.email} onChange={handleChange} />

          <CustomInput
            placeholder='비밀번호(6~12자리,한 개 이상의 영문자, 숫자로 입력해주세요)'
            name='password'
            type='password'
            value={formData.password}
            onChange={handleChange}
          />

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
