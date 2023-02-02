import React, { useEffect } from 'react';
import { userState } from '../atom/userState';
import { useRecoilValue } from 'recoil';
import { NextRouter, useRouter } from 'next/router';
import styled from '@emotion/styled';
import { FlexCenterLayout } from '../components/common/UI/Layout';

function Home() {
  const userEmail: string = useRecoilValue<string>(userState);
  const router: NextRouter = useRouter();

  useEffect(() => {
    if (!userEmail) {
      router.push('/signin');
    }
  }, []);

  return (
    <HomeLayout>
      <UserPreviewLayout>친구야 안녕?</UserPreviewLayout>
      <ChatRoomLayout>안ㄴ녕</ChatRoomLayout>
    </HomeLayout>
  );
}

const HomeLayout = styled(FlexCenterLayout)`
  flex-direction: row;
`;

const UserPreviewLayout = styled.aside`
  flex: 1;
  height: 100vh;
  background-color: pink;
`;

const ChatRoomLayout = styled.main`
  flex: 34rem;
  height: 100vh;
  background-color: blue;
`;

export default Home;
