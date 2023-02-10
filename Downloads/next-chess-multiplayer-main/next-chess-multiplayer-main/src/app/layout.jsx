import "./globals.css";
import Script from "next/script";

import "./output.css";
import Head from "next/head";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <title>KGV Chess | The blazingly fast chess multiplayer</title>
        <meta
          name="description"
          content="Play chess against your friends with a multiplayer link, over the board, or fight bots. King George V KGV Chess."
        ></meta>
        <meta name="og:title" property="og:title" content="KGV Chess"></meta>
        <meta name="robots" content="index, follow"></meta>
      </Head>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8371486404971647"
        crossorigin="anonymous"
      ></Script>
      {/*
        <head /> will contain the components returned by the nearest parent
        head.jsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>{children}</body>
    </html>
  );
}
