import React, { useContext, useState } from "react";

import {
  AcademicCapIcon,
  ArrowsRightLeftIcon,
  CpuChipIcon,
  LinkIcon,
  MagnifyingGlassIcon,
  ViewfinderCircleIcon,
} from "@heroicons/react/24/outline";

import { v4 as uuidv4 } from "uuid";
import { db } from "../firebase";
import { useRouter } from "next/navigation";

export default function Button({ context }) {
  const [user, setUser] = useContext(context).user;
  const [statusInfo, setStatusInfo] = useState("");
  const router = useRouter();
  const createGame = () => {
    let min = prompt(
      "How much time would you like each persons clock to be? (1m - 60m integer values)"
    );

    if (min < 1 || min > 60 || min % 1 !== 0 || !min) {
      alert("This time is invalid. How do you mess this up idiot?");
      return;
    }

    setStatusInfo("Creating Game...");
    const id = uuidv4();

    db.collection("games")
      .doc(id)
      .set({
        creator: user?.email,
        creatorUid: localStorage.getItem("email"),
        members: [{ white: user?.email, uid: localStorage.getItem("email") }],
        started: false,
        fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        ticking: "w",
        blackTime: `ST${min}:00`,
        whiteTime: `ST${min}:00`,
        // maxTime:
      })
      .then(() => {
        if(typeof window !== "undefined") {
        window.location.pathname = `/games/${id}`;
        }
        setStatusInfo("Redirecting...");
      });
  };

  return (
    <>
      {statusInfo && (
        <div className="w-[100vw] h-[100vh] bg-[#00000088] absolute inset-0 z-10">
          <div className="w-[100%] h-[100%] flex items-center justify-center text-[40px]">
            {statusInfo}
          </div>
        </div>
      )}

      <button className=" brightness-[0.45] flex items-center space-x-2 w-[300px] transition duration-200 ease-in-out hover:scale-105">
        <MagnifyingGlassIcon className="w-7 h-7 text-[white]" />
        <p
          onClick={() => {
            router.push("/");
          }}
          className="text-[#9b9b9b]"
        >
          Search games (coming soon)
        </p>
      </button>
      <button
        onClick={createGame}
        className="flex items-center space-x-2 transition duration-200 ease-in-out hover:scale-105"
      >
        <LinkIcon className="w-7 h-7 text-[white]" />
        <p className="text-[#9b9b9b]">Create Game With Link</p>
      </button>
      <button onClick={() => router.push("/board")} className="flex items-center space-x-2 transition duration-200 ease-in-out hover:scale-105">
        <ArrowsRightLeftIcon className="w-7 h-7 text-[white]" />
        <p className="text-[#9b9b9b]">Over the board</p>
      </button>
    </>
  );
}
