import { createGetInitialProps } from "@mantine/next";
import { Head, Html, Main, NextScript } from "next/document";


const getInitialProps = createGetInitialProps();

export default function Document() {
  
  // getInitialProps();
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
