"use client";

import Image from "next/image";
// import { Inter } from "@next/font/google";
import styles from "./page.module.css";

import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";
import { auth, db, provider } from "../../firebase";
import { useRouter } from "next/navigation";
import Head from "next/head";
import { AtSymbolIcon } from "@heroicons/react/24/outline";
import Moment from "react-moment";

// const inter = Inter({ subsets: ["latin"] });

// const interBold = Inter({ subsets: ["latin"], weight: "700" });

export default function Home() {
  const router = useRouter();

  const signUp = () => {
    auth.signInWithPopup(provider).then((result) => {
      const user = result.user;
      const uid = user?.uid;
      localStorage.setItem("email", `${user?.uid}`);
      db.collection("users")
        .doc(uid)
        .get()
        .then(async (doc) => {
          if (doc.exists) {
            if (localStorage.getItem("redirect")) {
              if (typeof window !== "undefined") {
                window.location.href = localStorage.getItem("redirect");
              }
              localStorage.setItem("redirect", "");
            } else router.push("/deck");
          } else {
            db.collection("users")
              .doc(uid)
              .set({
                displayName: user?.displayName,
                email: user?.email,
                photoURL: user?.photoURL,
                elo: 800,
              })
              .then(() => {
                if (localStorage.getItem("redirect")) {
                  localStorage.setItem("redirect", "");
                  if (typeof window !== "undefined") {
                    window.location.href = localStorage.getItem("redirect");
                  }
                } else router.push("/deck");
              });
          }
        });
    });
  };


  return (
    <main className={styles.main}>
      <Head>
        <title>KGV Chess | The blazingly fast chess multiplayer</title>
        <meta
          name="description"
          content="Play chess against your friends with a multiplayer link, over the board, or fight bots. King George V KGV Chess."
        ></meta>
        <meta name="og:title" property="og:title" content="KGV Chess"></meta>
        <meta name="robots" content="index, follow"></meta>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"></meta>
      </Head>
      <div
        className={`${styles.description} flex justify-between items-center `}
      >
        <button
          onClick={signUp}
          className={`cursor-pointer hover:scale-105 transition duration-200 text-[14px] flex gap-2 items-center bg-blue-500`}
        >
          Start Playing
          <ArrowLeftOnRectangleIcon className="w-6 h-6" />
        </button>
        <div>
          <a
            href="https://github.com/VivaanKumar"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[16px] text-[#ffffff] space-x-[6px]"
          >
            <Image src="./github.svg" width={24} height={24} priority />
            <h1>Vivaan Kumar</h1>
          </a>
        </div>
      </div>


      <div className={styles.center}>
        <div className={styles.logo}>
          <h1 className="text-[60px]">

            {/* <img className="w-[210px] h-[200px]" src="./logo.png" /> */}
            <div>KGV Chess</div>
          </h1>
        </div>

        <div className={styles.thirteen}>
          <h1 className="text-[24px]">
            <div >V2</div>
          </h1>
        </div>
      </div>

      <div className={`${styles.grid} gap-4`}>


      <a className={styles.card}>
          <div className="flex items-center space-x-2 items-center">
            <div className="translate-y-[-4px] w-2 h-2 bg-blue-500 rounded-[99px] animate-pulse"></div>
            <h2 className="">Version 1.3</h2>
          </div>
          <p>
            Incase you have no friends, you can now try and learn puzzles with the new Puzzles Section.

            <br />
            <br />
            <Moment className="font-bold" fromNow>Sat Feb 18 2023 17:43:49 GMT+0800</Moment>
          </p>
        </a>

        <a className={styles.card}>
          <h2 >Lots Of Features</h2>
          <p >
            Includes player clocks, premoves, game chat, arrows, resignation, drawing, customizable boards and much more!
          </p>
        </a>

        <a className={styles.card}>
          <h2 >Play With Friends</h2>
          <p >
            Create a game and share the link to play with friends.
          </p>
        </a>
      </div>
    </main>
  );
}

// export { inter, interBold };
