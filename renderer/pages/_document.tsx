import React from 'react';
// import Document, { Html, Head, Main, NextScript } from 'next/document';
import { Html, Head, Main, NextScript } from 'next/document';
import { Global } from '@emotion/react';
import { globalStyle } from '../style/globalStyle';

function Document() {
  return (
    <Html lang='en'>
      <Head>
        <meta charSet='utf-8' />
        <link
          rel='stylesheet'
          as='style'
          href='https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.6/dist/web/static/pretendard.css'
        />
      </Head>
      <Global styles={globalStyle} />
      <body>
        <div id='modal' />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

export default Document;
