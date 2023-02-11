import Link from 'next/link';
import { NextRouter, useRouter } from 'next/router';
import { inMemoryPersistence, setPersistence, signInWithEmailAndPassword } from 'firebase/auth';
import styled from '@emotion/styled';

import useInputValidation from '../hooks/useInputValidation';
import { auth } from '../firebaseConfig';

import { FlexColmunCenter } from '../components/common/UI/Layout';
import { CustomInput } from '../components/common/UI/CustomInput';
import { CustomButton } from '../components/common/UI/CustomButton';
import { CustomForm } from '../components/common/UI/CustomForm';
import { ErrorMessage } from '../components/common/UI/ErrorMessage';

function SignIn() {
  const [errorMessage, setErrorMessage, handleChange, formData] = useInputValidation(
    {
      email: '',
      password: '',
    },
    false
  );
  const router: NextRouter = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      await setPersistence(auth, inMemoryPersistence);

      const signInResponse = await signInWithEmailAndPassword(auth, formData.email, formData.password);

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

      <CustomForm onSubmit={handleSubmit}>
        <CustomInput name='email' placeholder='이메일' value={formData.email} onChange={handleChange} />

        <CustomInput
          type='password'
          name='password'
          placeholder='비밀번호'
          value={formData.password}
          onChange={handleChange}
        />

        <ErrorMessage>{errorMessage}</ErrorMessage>

        <CustomButton type='submit'>로그인</CustomButton>
      </CustomForm>

      <Link href={'/signup'}>
        <SignUpComment>아직 계정이 없으신가요? 회원가입하기</SignUpComment>
      </Link>
    </SignInLayout>
  );
}

const SignInLayout = styled(FlexColmunCenter)`
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
