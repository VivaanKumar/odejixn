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
import { Chess } from "chess.js";
import Head from "next/head";
import Moment from "react-moment";
import { ArrowPathIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import GameInfo from "components/GameInfo";

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

export default function Board() {

  const [allGames, setAllGames] = useState([]);
  const [currentLimit, setCurrentLimit] = useState(7);
  // const [rotate, setRotate] = useState

  useEffect(() => {
    db.collection("games").where("started", "==", true).orderBy("gameCreatedAt", "desc").limit(currentLimit).onSnapshot((snapshot) => {
      setAllGames(snapshot.docs.map((d) => ({ id: d.id, data: d.data() })));
    });
  }, [currentLimit])

  return (
    <UserProvider>
      <div className="w-[100vw] h-[100vh] flex flex-col items-center flex-grow-1 p-4 space-y-4">
        <Navbar context={UserContext} />

        <div className="bg-[#0a0a0a] border border-[#1a1a1a] w-[650px] h-fit rounded-md p-4 flex flex-col items-center space-y-4 justify-center">
          <h1 className="font-semibold text-[20px]">Recent Games</h1>
          <div className="w-[100%] h-[100%]">
            <div className="flex items-center justify-center p-1 w-[100%] h-[40px] border border-[#1a1a1a] bg-black rounded-t-[5px] divide-x divide-[#1a1a1a]">
              <div className="flex items-center h-[100%] w-[40%] justify-center text-gray-600 font-bold">
                Players
              </div>
              <div className="flex items-center h-[100%] w-[20%] justify-center text-gray-600 font-bold">
                Winner
              </div>
              <div className="flex items-center h-[100%] w-[40%] justify-center text-gray-600 font-bold">
                Date
              </div>


            </div>
            <div className="w-[100%] h-[fit] flex flex-col items-center justify-center ">
              {allGames?.length == 0 ? <div className={`mt-2 space-x-2 flex`}>
                <p>Loading...</p>
                <ArrowPathIcon className="w-7 h-7 text-[white]  animate-spin" />
              </div> : allGames?.map((d) => (
                <GameInfo id={d.id} data={d.data} key={d.id} />
              ))}
              {allGames?.length !== 0 && <p onClick={() => {
                if(currentLimit > 30) {
                  alert("You may not see more than 30 recent games. This is to avoid expensive server fetches");
                } else {
                  setCurrentLimit(currentLimit + 7);
                }
              }}className="mt-2 text-blue-500 cursor-pointer">See more</p>}
            </div>
          </div>
        </div>
      </div>
    </UserProvider>
  );
}
