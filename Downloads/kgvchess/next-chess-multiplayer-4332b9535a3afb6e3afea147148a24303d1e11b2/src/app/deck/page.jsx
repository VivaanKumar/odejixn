"use client";

import styles from "./../page.module.css";

import Navbar from "components/Navbar";
import React, { createContext, useContext, useEffect, useState } from "react";
import { interBold } from "../page";
import { db } from "../../../firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Chessboard } from "react-chessboard";
import Button from "components/Button";
import Head from "next/head";

const UserContext = createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const uid = localStorage.getItem("email")
      ? localStorage.getItem("email")
      : null;
    if (uid) {
      console.log(uid);
      db.collection("users")
        .doc(uid)
        .get()
        .then((doc) => {
          if (!doc.exists) {
            router.push("/");
          }
          setUser(doc.data());
          console.log(doc.data());
        });
    } else {
      router.push("/");
    }
  }, []);

  return (
    <UserContext.Provider value={{ user: [user, setUser] }}>
      {children}
    </UserContext.Provider>
  );
}

export default function page() {

  return (
    <UserProvider>
      <Head>
        <title>KGV Chess | The blazingly fast chess multiplayer</title>
        <meta
          name="description"
          content="Play chess against your friends with a multiplayer link, over the board, or fight bots. King George V KGV Chess."
        ></meta>
        <meta name="og:title" property="og:title" content="KGV Chess"></meta>
        <meta name="robots" content="index, follow"></meta>
      </Head>
      <div className="w-[100vw] h-[100vh] flex flex-col items-center flex-grow-1 p-4 space-y-4">
        <Navbar context={UserContext} />
        <div className="h-[100%] w-[65%] flex justify-center items-center space-x-8">
          <div className="flex flex-col space-y-4">
            <h1 className="text-[44px] font-semibold">KGV Chess</h1>
            <a
              href="https://github.com/VivaanKumar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[16px] text-[#ffffff] space-x-[6px] flex items-center space-x-2"
            >
              <img src="./github.svg" width={24} height={24} priority />
              <h1>Vivaan Kumar</h1>
            </a>

            <Button context={UserContext} />

            <p className="text-[#9b9b9b]">
              <span>© All Rights Reserved</span>
            </p>
          </div>

          <div className="max-md:hidden w-[450px] h-[450px]">
            <Chessboard

              boardWidth={450}
              position={"start"}
              customBoardStyle={{
                borderRadius: "5px",
                boxShadow: "0 5px 15px rgba(0, 0, 0, 0.5 ",
                backgroundImage: "url(./icy_sea.png)",
                backgroundSize: "cover",
              }}
              customLightSquareStyle={{ backgroundColor: "" }}
              customDarkSquareStyle={{ backgroundColor: "" }}
            />
          </div>
        </div>
      </div>
    </UserProvider>
  );
}
