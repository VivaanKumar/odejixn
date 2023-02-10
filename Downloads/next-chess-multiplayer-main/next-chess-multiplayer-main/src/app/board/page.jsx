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
  const [fen, setFen] = useState(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  );
  const [game, setGame] = useState(new Chess());

  const router = useRouter();
  function dropPiece(sourceSquare, targetSquare, piece) {
    const oldFen = game.fen();
    // console.log(piece.charAt(0) == side, !waiting);
    if (piece.charAt(0) == game.turn()) {
      const promotions = game
        .moves({ verbose: true })
        .filter((m) => m.promotion);
      let promotionTo = undefined;
      if (
        promotions.some(
          (p) => `${p.from}:${p.to}` == `${sourceSquare}:${targetSquare}`
        )
      ) {
        promotionTo = prompt(
          "Promote your pawn to: r (rook), b (bishop), q (queen), or n (knight)."
        );
        if (
          !(
            promotionTo == "r" ||
            promotionTo == "b" ||
            promotionTo == "q" ||
            promotionTo == "n"
          )
        ) {
          alert(
            "You did not enter a valid promotion to, your pawn will automatically be promoted to a queen."
          );
          promotionTo = "q";
        }
      }
      const legalMove = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: promotionTo,
      });
      if (legalMove) {
        setFen(game.fen());
        setGame(new Chess(game.fen()));
        // setState(null);

        
      }
    }
  }
  return (
    <UserProvider>
      <div className="w-[100vw] h-[100vh] flex flex-col items-center flex-grow-1 p-4 space-y-4">
      <Head>
        <title>KGV Chess | The blazingly fast chess multiplayer</title>
        <meta
          name="description"
          content="Play chess against your friends with a multiplayer link, over the board, or fight bots. King George V KGV Chess."
        ></meta>
        <meta name="og:title" property="og:title" content="KGV Chess"></meta>
        <meta name="robots" content="index, follow"></meta>
      </Head>
        <Navbar context={UserContext} />
        <Chessboard
          onPieceDrop={dropPiece}
          boardWidth={600}
          position={fen}
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
    </UserProvider>
  );
}
