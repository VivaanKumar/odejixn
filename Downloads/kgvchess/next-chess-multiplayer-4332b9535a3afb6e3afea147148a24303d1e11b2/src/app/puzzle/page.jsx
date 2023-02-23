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
import { ArrowLeftIcon, ArrowPathIcon, CheckIcon, NoSymbolIcon, PlusIcon, StarIcon } from "@heroicons/react/24/solid";
import { LightBulbIcon, PuzzlePieceIcon } from "@heroicons/react/24/outline";

import data from "../puzzles.json";

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


  console.log(data);

  var ranPuzzle = data[Math.floor(Math.random()*data.length)];

  // ranPuzzle.title;

  console.log(ranPuzzle);

  const [fen, setFen] = useState(
    ranPuzzle.fen
  );

  const [computerFirstDoes, setComputerFirstDoes] = useState(ranPuzzle.computerFirstDoes);

  const [computerStep, setComputerStep] = useState(0);

  const [humanFirstDoes, setHumanFirstDoes] = useState(ranPuzzle.humanFirstDoes);

  const [humanStep, setHumanStep] = useState(0);

  const [title, setTitle] = useState(ranPuzzle.title);

  const [hasHint, setHasHint] = useState(true);

  const [side, setSide] = useState(ranPuzzle.side);

  const [finishedPuzzle, setFinishedPuzzle] = useState(false);

  const [messages, setMessages] = useState([]);

  const [game, setGame] = useState(new Chess(ranPuzzle.fen));

  const [newPuzzlee, setNewPuzzlee] = useState(0); 


  const delay = (delayInms) => {
    return new Promise(resolve => setTimeout(resolve, delayInms));
  }

  useEffect(() => {
    computerDoMove(computerStep)
  }, [newPuzzlee])

  const computerDoMove = async (jw) => {

    // await delay(1000);

    // console.log(jw);
    // game.setTurn("b");
    const isLegal = game.move({
      from: computerFirstDoes[jw].from,
      to: computerFirstDoes[jw].to,
      // promotion: promotionTo,
    });
    if (isLegal) {
      setFen(game.fen());
      setGame(new Chess(game.fen()));
      // setState(null);


    }
  }

  const router = useRouter();
  function dropPiece(sourceSquare, targetSquare, piece) {
    const oldFen = game.fen();
    // console.log(piece.charAt(0) == side, !waiting);
    if (piece.charAt(0) == game.turn() && piece.charAt(0) == side) {
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
      if (sourceSquare == humanFirstDoes[humanStep].from && targetSquare == humanFirstDoes[humanStep].to) {
        game.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: promotionTo,
        });

        dehumanize();
        setFen(game.fen());
        setGame(new Chess(game.fen()));

        setHumanStep(humanStep + 1);
        setHasHint(true);

        // console.log("FINAL: ", computerFirstDoes.length, computerStep);

        setMessages(current => [...current, {
          error: false,
          message: "This was the correct move!"
        }]);

        if (computerFirstDoes.length <= computerStep + 1) {
          // alert("Great jpb");
          setFinishedPuzzle(true);
        } else {
          setComputerStep(computerStep + 1);

          computerDoMove(computerStep + 1);
        }

        // setState(null);


      } else {
        setMessages(current => [...current, {
          error: true,
          message: "This is a bad move. Try again!"
        }]);
      }
    }
  }
  function highlight(square) {
    if (game.turn() !== side) return;
    let moves = game.moves({ square, verbose: true });
    // if(game.turn())
    if (moves.length !== 0) {
      moves.map((move) => {
        // console.log(move);
        let highlightable = document.querySelector(
          `[data-square="${move.to}"]`
        );
        const hoverElem = document.createElement("div");
        hoverElem.classList.add("hover")
        if (highlightable) {
          highlightable.appendChild(hoverElem);
        }
      });
    }
  }
  function dehighlight() {
    document.querySelectorAll(".hover").forEach((square) => {
      square.remove();
    });
  }

  function dehumanize() {
    let getAllSquares = document.querySelectorAll('[data-square]');

    for (let i = 0; i < getAllSquares.length; i++) {
      getAllSquares[i].style.backgroundColor = "";
    }
  }
  
  function newPuzzle () {
    // alert('nw puzzle');


    var ranPuzzle_ = data.filter((d) => d.title !== title)[Math.floor(Math.random()*data.length)];

    setComputerFirstDoes(ranPuzzle_.computerFirstDoes);

 setComputerStep(0);

 setHumanFirstDoes(ranPuzzle_.humanFirstDoes);

 setHumanStep(0);

 setHasHint(true);

 setTitle(ranPuzzle_.title);

  setSide(ranPuzzle_.side);

  setFinishedPuzzle(false);

  setMessages([]);

  setGame(new Chess(ranPuzzle_.fen));
  setFen(ranPuzzle_.fen);
    
  setNewPuzzlee(Math.floor(Math.random() * 100000000));

  }

  return (
    <UserProvider>
      <div className="w-[100vw] h-[100vh] flex flex-col items-center flex-grow-1 p-4 space-y-4">
        <Navbar context={UserContext} />
        {/* <div className="flex"> */}
        <div className="flex space-x-4">
          <div className="">
            <Chessboard
              onPieceDrop={dropPiece}
              boardWidth={550}
              position={fen}
              onMouseOverSquare={highlight}
              onMouseOutSquare={dehighlight}
              customBoardStyle={{
                borderRadius: "5px",
                boxShadow: "0 5px 15px rgba(0, 0, 0, 0.5 ",
                backgroundImage: "url(./icy_sea.png)",
                backgroundSize: "cover",
              }}
              boardOrientation={side == "w" ? "white" : "black"}
              customLightSquareStyle={{ backgroundColor: "" }}
              customDarkSquareStyle={{ backgroundColor: "" }}
              animationDuration={300}
            />
          </div>


          <div className="flex flex-col items-center space-y-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-[5px] h-[550px] w-[350px]">
            <div className={`transition duration-200 w-[350px] h-[80px] ${finishedPuzzle ? "bg-[#7fa650]" : "bg-[#31302f]"} rounded-t-[5px] flex items-center justify-between px-4`}>
              <PlusIcon onClick={newPuzzle} className="w-7 h-7 text-[white] cursor-pointer" />

              <div className="flex items-center justify-center space-x-4">
                {finishedPuzzle ? (<div className="flex items-center space-x-2">
                  <CheckIcon className="w-7 h-7 text-[white]"/>
                  <h1 className="text-xl font-bold">Solved</h1>
                </div>) : (<>
                  <div className={`w-6 h-6 rounded-[2px] bg-[${side == "w" ? "white" : "#312e2b"}] border-2 border-[#83817f]`}></div>
                  <h1 className="text-xl">{side == "w" ? "White" : "Black"} is You</h1>
                </>)}
              </div>


              <p></p>
            </div>

            <p>1 New Puzzle Every Day!</p>

            <button onClick={() => {
              if(finishedPuzzle) {
                newPuzzle();
              } else {
                if(hasHint) {
                  const pieceFrom = humanFirstDoes[humanStep].from;

                  // console.log(pieceFrom);

                  let toHighlight = document.querySelector(
                    `[data-square="${pieceFrom}"]`
                  );


                  toHighlight.style.backgroundColor = "rgba(0, 255, 80, 0.3)";

                  setHasHint(false);
                }
              }
            }} className="transition duration-200 ease-in-out hover:brightness-[1.2] hover:scale-105 w-[70%] h-[60px] bg-black text-[white] flex items-center justify-center space-x-2">
              {finishedPuzzle ? <PuzzlePieceIcon className="w-7 h-5 text-white" /> : <LightBulbIcon className="w-7 h-5 text-white" />}
              <p className="text-white font-[30px]">{finishedPuzzle ? "New Puzzle" : "Hint"}</p>
            </button>

            <div className="space-y-2 flex flex-col items-center justify-center">
              <p className="text-white font-bold">Random Puzzles</p>
              <h1 className="text-[28px] italic">'{ title}'</h1>
            </div>

            <div className="w-[100%] h-[300px] overflow-auto">
              {messages.map((m) => (
                <div className="flex items-center space-x-2 px-4" key={m.title}>
                  <p>{!m.error ? <StarIcon className="w-7 h-7 text-[#7fa650]"/> : <NoSymbolIcon className="w-7 h-7 text-red-800"/>}</p>
                  <p>{m?.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* </div> */}
      </div>


      {/* </div> */}

    </UserProvider>
  );
}