"use client";

import Navbar from "components/Navbar";
import { db } from "../../../../firebase";
import { useRouter } from "next/navigation";
import React, { createContext, useState, useEffect, Fragment } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import {
  ArrowsUpDownIcon,
  BookOpenIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClockIcon,
  FireIcon,
  LinkIcon,
  NoSymbolIcon,
  PauseCircleIcon,
  PauseIcon,
  PencilIcon,
  PlayPauseIcon,
  WrenchScrewdriverIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
// import data from "../../eco.json";
import { FlagIcon, PaperAirplaneIcon } from "@heroicons/react/24/solid";
import Moment from "react-moment";
import moment from "moment";
import { Menu, Transition } from "@headlessui/react";

import icy_sea from "../../../../public/icy_sea.png";
import walnut from "../../../../public/walnut.png";
import tournament from "../../../../public/tournament.png";
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

export default function Page() {
  const [ambient, setAmbient] = useState(false);
  const [game, setGame] = useState(new Chess());
  const [user, setUser] = useState(null);
  // if (typeof window !== "undefined") {
  const id =
    typeof window !== "undefined"
      ? window.location.pathname.replaceAll("/games/", "")
      : null;
  // }
  const [side, setSide] = useState(undefined);
  const [said, setSaid] = useState(false);

  const [opening, setOpening] = useState("Finding...");

  const [whiteEval, setWhiteEval] = useState(0);
  const [blackEval, setBlackEval] = useState(0);

  const [style, setStyle] = useState(false);

  const [boardStyle, setBoardStyle] = useState(icy_sea);

  const [messages, setMessages] = useState([]);

  const [fen, setFen] = useState(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  );
  const [allowed, setAllowed] = useState(true);
  const [waiting, setWaiting] = useState(true);
  const [state, setState] = useState(null);
  const [playingAgainst, setPlayingAgainst] = useState(null);
  const [ourUser, setOurUser] = useState(null);

  const [cap, setCap] = useState("");

  const [notifStarted, setNotifStarted] = useState(false);

  const [entireGame, setEntireGame] = useState(false);

  useEffect(() => {
    const uid = localStorage.getItem("email")
      ? localStorage.getItem("email")
      : null;
    if (uid) {
      const today = new Date().setMinutes(new Date().getMinutes() + 30);
      db.collection("users")
        .doc(uid)
        .onSnapshot((docc) => {
          if (!docc.exists) {
            alert("After you log in, you will be redirected to this game.");
            //
            if (typeof window !== "undefined") {
              localStorage.setItem("redirect", window.location.href);
              window.location.href = "/";
            }
          } else {
            setOurUser(docc.data());
            console.log(docc.data());
            db.collection("games")
              .doc(id)
              .onSnapshot((doc) => {
                const data = doc?.data();
                setEntireGame(data);
                const userEmail = docc.data()?.email;
                console.log(doc.data());
                console.log(doc?.data().creator, userEmail);

                if (doc.data().resigned) {
                  setState({
                    what: "Ended by resignation.",
                    user: `${doc.data().resigned} resigned.`,
                  });
                }

                if (data.creator == userEmail) {
                  for (let i = 0; i < data.members.length; i++) {
                    console.log(data.creator, data.members[i].white);
                    if (data.members[i].white == userEmail) {
                      console.log("CREATOR = W");
                      setSide("w");
                      break;
                    } else {
                      console.log("CREATOR = B");
                      setSide("b");
                      break;
                    }
                  }

                  if (data.members.length >= 2) {
                    // alert("Niga");
                    db.collection("users")
                      .doc(doc.data().members[1].uid)
                      .get()
                      .then((deoid) => {
                        setPlayingAgainst(deoid.data());

                        // alert("niggfa");

                        // if(!notifStarted) {
                        //   new Notification("Your Velo Chess Game has started!");
                        //   setNotifStarted(true);
                        // }
                      });
                  }
                } else {
                  db.collection("users")
                    .doc(data.creatorUid)
                    .get()
                    .then((doccc) => {
                      setPlayingAgainst(doccc?.data());
                      console.log(doccc?.data());
                    });
                  if (data.members[0].white) {
                    if (
                      data.members.length <= 1 ||
                      data.members[1].white == userEmail ||
                      data.members[1].black == userEmail
                    ) {
                      if (data.members[0].white == userEmail) {
                        setSide("w");
                        let members = data.members;
                        if (!(members.length >= 2)) {
                          members.push({
                            white: userEmail,
                            uid: localStorage.getItem("email"),
                          });
                        }
                        db.collection("games").doc(id).update({
                          members,
                          started: true,
                        });
                      } else {
                        setSide("b");
                        let members = data.members;
                        if (!(members.length >= 2)) {
                          members.push({
                            black: userEmail,
                            uid: localStorage.getItem("email"),
                          });
                        }

                        db.collection("games").doc(id).update({
                          members,
                          started: true,
                        });
                      }
                    } else {
                      setAllowed(false);
                    }
                  }
                }
              });
          }
        });
    } else {
      alert("After you log in, you will be redirected to this game.");
      //
      if (typeof window !== "undefined") {
        localStorage.setItem("redirect", window.location.href);
        window.location.href = "/";
      }
    }
  }, []);

  // useEffect(() => {
  //   setOpening("Finding opening...");

  //   // console.log(data);

  //   for(let i = 0; i < data.length; i++) {
  //     // console.log(data[i].fen, game.fen())
  //     if(data[i].fen == game.fen().split("-")[0].replaceAll(" ", "")) {
  //       setOpening(data[i].name);
  //       break;
  //     }
  //   }
  // }, [game.fen()]);

  useEffect(() => {
    const toEval = game.fen().split("w")[0].replaceAll(" ", "");

    let whiteEval = 0;
    let blackEval = 0;

    for (let i = 0; i < toEval.length; i++) {
      const p = toEval[i];

      if (p == "p") {
        blackEval += 1;
      } else if (p == "r") {
        blackEval += 5;
      } else if (p == "b") {
        blackEval += 3;
      } else if (p == "n") {
        blackEval += 3;
      } else if (p == "q") {
        blackEval += 9;
      }

      if (p == "P") {
        whiteEval += 1;
      } else if (p == "R") {
        whiteEval += 5;
      } else if (p == "B") {
        whiteEval += 3;
      } else if (p == "N") {
        whiteEval += 3;
      } else if (p == "Q") {
        whiteEval += 9;
      }
    }

    console.log("EVAL", whiteEval, blackEval);
    setWhiteEval(whiteEval);
    setBlackEval(blackEval);
  }, [game.fen()]);

  useEffect(() => {
    console.log("the i d:", id);
    db.collection("games")
      .doc(id)
      .onSnapshot((doc) => {
        // moveSfx.play();
        // for(let i = 0; i < doc?.data()?.members.length; i ++) {
        //   console.log(doc?.data()?.members[i])
        //   if(doc?.data()?.members[i].white && doc?.data()?.members[i].white == localStorage.getItem("email")){
        //     //we white
        //     console.log("WE WHITE")
        //   } else if(doc?.data()?.members[i].black && doc?.data()?.members[i].white == localStorage.getItem("email")){
        //     //we black
        //     console.log("WE BLACK")
        //   }
        // }

        if (doc?.data()?.members.length >= 2 && waiting == true) {
          setWaiting(false);
        }

        if (doc.data().resigned) {
          setState({
            what: "Ended by resignation.",
            user: `${doc.data().resigned} resigned.`,
          });
        }

        const fen2 = doc?.data()?.fen;
        console.log(doc?.data()?.members);
        if (doc?.data()?.members.length >= 2 && waiting == true) {
          setWaiting(false);
        }
        setFen(fen2);
        setState(null);
        setGame(new Chess(fen2));

        console.log("fen,", fen2);
        if (new Chess(fen2).inCheck()) {
          // setState({
          //   what: new Chess(fen2).turn() == "b" ? "Black" : "White",
          //   user: " is in check",
          // });
        }
        if (new Chess(fen2).isCheckmate()) {
          // if(side == new Chess(fen).turn()) {
          //   addElo();
          // } else {
          //   takeElo();
          // }
          db.collection("games")
            .doc(id)
            .update({
              loser: new Chess(fen2).turn(),
            });
          setState({
            what: "Checkmate!",
            user:
              `Loser is ` +
              (new Chess(fen2).turn() == "b" ? "black." : "white."),
          });
          if (new Chess(fen2).isInsufficientMaterial()) {
            setState({
              what: "Insufficient material.",
              user: `No winner.`,
            });
          }

          if (new Chess(fen2).isStalemate()) {
            setState({
              what: "Insufficient material.",
              user: `No winner.`,
            });
          }
          if (new Chess(fen2).isThreefoldRepetition()) {
            // console.log(new Chess(fen2).turn(), new Chess(fen2).in_checkmate());
            setState({
              what: "Three fold repition.",
              user: `No winner.`,
            });
          }
        }
      });
  }, []);

  useEffect(() => {
    if (ourUser) {
      db.collection("games")
        .doc(id)
        .get()
        .then((doc) => {
          if (
            doc?.data()?.creator == ourUser.email &&
            doc?.data()?.members.length >= 2
          ) {
            let members = doc?.data()?.members;
            let otherUser = members.find(
              (member) =>
                member.white !== ourUser.email && member.black !== ourUser.email
            );

            if (otherUser.white) {
              console.log(otherUser.uid);
              db.collection("users")
                .doc(otherUser.uid)
                .get()
                .then((docccc) => {
                  setPlayingAgainst(docccc?.data());
                  console.log(docccc?.data());
                });
            } else if (otherUser.black) {
              console.log(otherUser.uid);
              db.collection("users")
                .doc(otherUser.uid)
                .get()
                .then((docccc) => {
                  setPlayingAgainst(docccc?.data());
                  console.log(docccc?.data());
                });
            }
          }
        });
    }
  }, [ourUser, fen, game]);

  useEffect(() => {
    if (!("Notification" in window)) {
      console.log("Browser does not support desktop notification");
    } else {
      Notification.requestPermission();
    }
  }, []);

  function dropPiece(sourceSquare, targetSquare, piece) {
    const oldFen = game.fen();
    console.log(piece.charAt(0) == side, !waiting);
    if (piece.charAt(0) == side && !waiting) {
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
        setState(null);

        let tickNext = "";

        if (entireGame?.ticking == "w") {
          tickNext = "b";
        } else {
          tickNext = "w";
        }

        const otherTime = (
          side !== "w" ? entireGame?.whiteTime : entireGame?.blackTime
        )
          ?.replaceAll("ST", "")
          .split(":");

        const otherTime_mm = Number(otherTime[0]);
        const otherTime_ss = Number(otherTime[1]);

        const newOtherDate = moment(new Date())
          .add(otherTime_mm, "m")
          .add(otherTime_ss, "s")
          .toDate();

        console.log(oldFen);

        if (
          !(
            oldFen == "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
          )
        ) {
          let ourCurrentTime =
            side == "w" ? entireGame?.whiteTime : entireGame?.blackTime;

          // console.log(ourCurrentTime.toDate(), new Date());

          let a = moment(ourCurrentTime.toDate());
          let b = moment(new Date());
          const time = "ST" + moment(a.diff(b)).format("m:s");

          if (side == "w") {
            db.collection("games").doc(id).update({
              whiteTime: time,
            });
          } else {
            db.collection("games").doc(id).update({
              blackTime: time,
            });
          }
        }

        // console.log(myTime_mm, myTime_ss);

        db.collection("games").doc(id).update({
          fen: game.fen(),
          ticking: tickNext,
        });

        if (side == "w") {
          db.collection("games").doc(id).update({
            blackTime: newOtherDate,
          });
        } else {
          db.collection("games").doc(id).update({
            whiteTime: newOtherDate,
          });
        }
      }
    }
  }

  let interval;

  useEffect(() => {
    startTimer();
    return () => {
      clearInterval(interval);
    };
  });

  function startTimer() {
    interval = setInterval(() => {
      // console.log(entireGame);
      if (entireGame?.whiteTime?.seconds) {
        if (entireGame?.whiteTime?.toDate() < new Date()) {
          db.collection("games")
            .doc(id)
            .update({
              whiteTime: "ST00:00",
              timed: side == "w" ? ourUser?.email : playingAgainst?.email,
            });
        }
      }

      if (entireGame?.blackTime?.seconds) {
        if (entireGame?.blackTime?.toDate() < new Date()) {
          db.collection("games")
            .doc(id)
            .update({
              blackTime: "ST00:00",
              timed: side == "b" ? ourUser?.email : playingAgainst?.email,
            });
        }
      }
    }, 1000);
  }

  useEffect(() => {
    db.collection("games")
      .doc(id)
      .collection("msg")
      .orderBy("timestamp")
      .onSnapshot((doc) => {
        let allDocs = doc.docs.map((d) => ({ id: d.id, data: d.data() }));
        // console.log(allDocs);
        setMessages(allDocs);
      });
  }, []);

  useEffect(() => {
    if (entireGame?.drawed) {
      setState({
        what: "Draw",
        user: "Both players have agreed to a draw",
      });
    } else if (entireGame?.timed) {
      setState({
        what: "Time up!",
        user: `${entireGame?.timed} has lost on time!`,
      });
    }
  }, [entireGame]);

  return (
    <div className="w-[100vw] h-[100vh] flex flex-col items-center flex-grow-1 p-4 space-y-4">
      <UserProvider>
        <Navbar context={UserContext} />
      </UserProvider>
      <Head>
        <title>KGV Chess | The blazingly fast chess multiplayer</title>
        <meta
          name="description"
          content="Play chess against your friends with a multiplayer link, over the board, or fight bots. King George V KGV Chess."
        ></meta>
        <meta name="og:title" property="og:title" content="KGV Chess"></meta>
        <meta name="robots" content="index, follow"></meta>
      </Head>

      <div className="h-[100%] w-[65%] flex justify-center items-center space-x-6">
        {side ? (
          <div className="flex flex-col space-y-0 w-[250px] flex-grow-1 justify-start items-start backdrop-blur-md">
            <div className="flex flex-col space-y-[12px] items-start h-fit z-[100]">
              <div className="w-[250px] flex items-center justify-center space-x-3">
                {!state && (
                  <>
                    <button
                      onClick={() => {
                        if (typeof window !== "undefined") {
                          let confirm = window.confirm(
                            "Are you sure you want to resign? You will lose this Velo Chess Match."
                          );
                        }

                        if (confirm) {
                          setState({
                            what: "Ended by resignation.",
                            user: `${ourUser?.email} resigned.`,
                          });

                          db.collection("games").doc(id).update({
                            resigned: ourUser?.email,
                          });
                        }
                      }}
                      className="flex items-center gap-2 w-fit h-[50px] hover:scale-105 transition duration-200 ease-in-out"
                    >
                      Resign
                      <NoSymbolIcon className="w-6 h-6 text-[white] text-[12px]" />
                    </button>
                    {true && (
                      <button
                        onClick={() => {
                          db.collection("games")
                            .doc(id)
                            .update({
                              draw: ourUser?.email,
                            })
                            .then(() => {
                              alert(
                                "You have commisioned the other player for a draw!"
                              );
                            });
                        }}
                        className={`hover:scale-105 transition duration-200 ease-in-out flex h-[50px] text-[16px] items-center gap-2 text-[white] ${
                          entireGame?.draw &&
                          "cursor-default brightness-[0.45] pointer-events-none"
                        }`}
                      >
                        Draw <ArrowsUpDownIcon className="w-6 h-6" />
                      </button>
                    )}
                  </>
                )}
              </div>
              {/* {playingAgainst && <h1>Opponent:</h1>} */}
              <div className="flex items-center justify-center w-[250px]">
                {playingAgainst && (
                  <img
                    className="w-[48px] h-[48px] rounded-l-[12px] outline-none border-none rounded-b-none"
                    src={playingAgainst?.photoURL}
                  />
                )}
                <p
                  className={`bg1 h-[48px] w-[202px] flex-col flex items-center justify-center text-[12px] text-[#9b9b9b] rounded-r-[12px] rounded-br-[0px] ${
                    playingAgainst
                      ? ""
                      : "w-full rounded-[12px] h-[200px] text-[24px] border-none p-2 space-y-2"
                  }`}
                >
                  {playingAgainst ? (
                    playingAgainst?.email.toUpperCase().substring(0, 17) + "..."
                  ) : (
                    <div className="flex flex-col justify-center space-y-2">
                      <p className="text-[18px]">Waiting for a player...</p>
                      <input
                        readOnly
                        className="p-2 bg-transparent border-b text-[16px] hover:outline-none active:outline-none focus:outline-none border-[white]"
                        value={
                          typeof window !== "undefined" && window.location.href
                        }
                      />
                      <button
                        onClick={() => {
                          if (typeof window !== "undefined") {
                            navigator.clipboard.writeText(window.location.href);
                            alert("Copied to clipboard!");
                          }
                        }}
                        className="h-[40px] flex items-center justify-center text-[16px] space-x-2 mt-2 bg-blue-500 border-none"
                      >
                        <LinkIcon className="w-6 h-6 text-[white]" />{" "}
                        <p className="text-[white]">Copy link</p>
                      </button>
                    </div>
                  )}
                </p>
              </div>
            </div>

            {playingAgainst && (
              <>
                {/* <h1>Chat:</h1> */}

                <div className="bg1 w-[250px] h-[370px] flex-col rounded-b-[12px] flex justify-between items-center gap-2 mb-3">
                  <div className="h-[300px] w-[100%] space-y-2 overflow-auto">
                    {messages.map((m) => (
                      <div
                        key={m.id}
                        className="flex flex-col bg1 p-[2px]  gap-[2px] rounded-[12px] h-fit"
                      >
                        <b>{m.data.user.substring(0, 10)}... :</b>
                        <p>{m.data.cap}</p>
                      </div>
                    ))}
                  </div>
                  <div className="h-[52px] w-[100%] flex items-center justify-center">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (cap) {
                          db.collection("games").doc(id).collection("msg").add({
                            user: ourUser?.email,
                            cap,
                            timestamp: new Date(),
                          });
                          setCap("");
                        }
                      }}
                    >
                      <input
                        onChange={(e) => setCap(e.target.value)}
                        value={cap}
                        placeholder={"Type a message..."}
                        className="w-[100%] h-[100%] bg-transparent p-2 rounded-[12px]"
                      />
                    </form>
                  </div>
                </div>
                <br />
                <h1
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      window.location.href =
                        "https://en.wikipedia.org/wiki/List_of_chess_openings";
                    }
                  }}
                  className="hover:underline text-gray-600 font-bold flex items-center space-x-2"
                >
                  <BookOpenIcon className="w-6 h-6 text-gray-600" />{" "}
                  <p>Common Openings</p>
                </h1>
              </>
            )}
          </div>
        ) : (
          <>
            {/* <h1>You are currently spectating this game as the game has already started between 2 players. You are not allowed to see the 2 opponent's usernames until the game finishes.</h1> */}
          </>
        )}

        <div className="space-y-3">
          {playingAgainst && (
            <div className="flex items-end justify-between">
              <div className="flex">
                <img
                  className="w-[48px] h-[48px] rounded-l-[5px] outline-none border-none"
                  src={playingAgainst?.photoURL}
                />
                <div
                  className={`h-[48px] rounded-r-[5px] flex items-center text-[20px] ${
                    side !== entireGame?.ticking
                      ? "bg-gray-100 border border-gray-300 text-[black] p-[1rem]"
                      : "bg1 text-[#383838]"
                  }`}
                >
                  {(side == "w" ? entireGame?.blackTime : entireGame?.whiteTime)
                    .seconds ? (
                    <>
                      <ClockIcon className="w-6 h-6 mr-2" />
                      <Moment
                        interval={1_000}
                        filter={(d) => d.replaceAll("-", "")}
                        durationFromNow
                        format="hh:mm:ss"
                        trim
                      >
                        {(side == "w"
                          ? entireGame?.blackTime
                          : entireGame?.whiteTime
                        ).toDate()}
                      </Moment>
                    </>
                  ) : (
                    <p className="flex items-center">
                      <PauseCircleIcon className="w-6 h-6 mr-2" />
                      {(side == "w"
                        ? entireGame?.blackTime
                        : entireGame?.whiteTime
                      )
                        ?.split("ST")[1]
                        ?.replaceAll(" ", "")}
                    </p>
                  )}
                </div>
              </div>

              <div className="scale-[0.70] translate-y-[9.5px] shadow-2xl">
                {entireGame?.draw && entireGame?.draw !== ourUser?.email && (
                  <div className="bg1 flex w-[250px] h-fit justify-between  items-center space-x-2 rounded-[12px] p-[2px]">
                    <p className="text-gray-500 text-[18px]">Accept Draw?</p>

                    {/* <div className="flex space-x-3"> */}
                    <button
                      onClick={() => {
                        db.collection("games").doc(id).update({
                          draw: null,
                        });
                      }}
                      className="h-[35px] w-[35px] flex items-center justify-center p-0 bg-red-500"
                    >
                      <XMarkIcon className="w-7 h-7" />
                    </button>
                    <button
                      className="h-[35px] w-[35px] flex items-center justify-center p-0 bg-green-600"
                      onClick={() => {
                        db.collection("games").doc(id).update({
                          draw: null,
                          drawed: true,
                        });
                        setState({
                          what: "Draw",
                          user: "Both players have agreed to a draw",
                        });
                      }}
                    >
                      <CheckIcon className="w-7 h-7" />
                    </button>
                  </div>
                  // </div>
                )}
              </div>

              <div
                onClick={() => {
                  if (typeof window !== "undefined") {
                    let e = window.confirm(
                      "Would you like to report this player for cheating / harrassment?"
                    );
                    if (e) {
                      alert(
                        "Your request has been prompted to the moderation team."
                      );
                    }
                  }
                }}
                className="bg1 rounded-[5px] flex items-center justify-center w-[50px] h-[50px] hover:cursor-pointer hover:scale-105 ease-in-out transition duration-200"
              >
                <FlagIcon className="w-[100%] h-[100%] text-red-500" />
              </div>
            </div>
          )}

          <div>
            <Chessboard
              boardWidth={470}
              position={fen}
              onPieceDrop={dropPiece}
              // onDrop={dropPiece}
              // onMouseOverSquare={highlight}
              // onMouseOutSquare={dehighlight}
              boardOrientation={side == "w" ? "white" : "black"}
              // arePremovesAllowed={true}
              // clearPremovesOnRightClick={true}
              showBoardNotation={false}
              // clearPremovesOnRightClick={true}
              customBoardStyle={{
                borderRadius: "5px",
                backgroundImage: `url(${boardStyle.src})`,
                backgroundSize: "cover",
                // boxShadow: "0px 0px 100px rgba(1, 65, 255, 0.4)",
              }}
              customLightSquareStyle={{
                backgroundColor: "",
                // border: "1.5px solid gray",
              }}
              customDarkSquareStyle={{
                backgroundColor: "",
                // border: "1.5px solid rgba(1, 65, 255, 0.4)",
              }}
            />
            {state && (
              <div className="p-6 z-[10] w-[470px] h-[470px] absolute translate-y-[-470px] translate-x-[6px] scale-[1.026] bg-[#00000097] backdrop-blur-[2px]">
                <div className="h-[100%] w-[100%] grid place-content-center">
                  <h1 className="text-[32px]">{state?.what}</h1>
                  <h1 className="text-[24px]">{state?.user}</h1>
                  <p>This game has ended.</p>
                </div>
              </div>
            )}

            {style && (
              <div className="z-[11] w-[470px] h-[470px] absolute translate-y-[-470px] scale-[1] bg-[#0a0a0a] p-6">
                <div className="bg1">Icy Sea (Default)</div>
              </div>
            )}
          </div>

          {playingAgainst && (
            <div className="flex items-center justify-between">
              <div className="flex">
                <img
                  className="w-[48px] h-[48px] rounded-l-[5px] outline-none border-none"
                  src={ourUser?.photoURL}
                />
                <div
                  className={`h-[48px] rounded-r-[5px] flex items-center text-[20px] ${
                    side == entireGame?.ticking
                      ? "bg-gray-100 border border-gray-300 text-[black] p-[1rem]"
                      : "bg1"
                  }`}
                >
                  {(side == "w" ? entireGame?.whiteTime : entireGame?.blackTime)
                    .seconds ? (
                    <>
                      <ClockIcon className="w-6 h-6 mr-2" />
                      <Moment
                        interval={1_000}
                        filter={(d) => d.replaceAll("-", "")}
                        durationFromNow
                        format="hh:mm:ss"
                        trim
                      >
                        {(side == "w"
                          ? entireGame?.whiteTime
                          : entireGame?.blackTime
                        ).toDate()}
                        {/* {console.log("THE FUCKING TIME, ", (side == "w"
                      ? entireGame?.whiteTime
                      : entireGame?.blackTime) )} */}
                      </Moment>
                    </>
                  ) : (
                    <p className="flex items-center">
                      <PauseCircleIcon className="w-6 h-6 mr-2" />
                      {(side == "w"
                        ? entireGame?.whiteTime
                        : entireGame?.blackTime
                      )
                        ?.split("ST")[1]
                        ?.replaceAll(" ", "")}
                    </p>
                  )}
                </div>
              </div>

              {/* <p>{ourUser?.email}</p> */}
              <p className="text-gray-600">
                {entireGame?.draw == ourUser?.email && "Asking for draw..."}
              </p>

              {/* <Menu>
                <Menu.Button>
                  <div className="bg1 rounded-[5px] flex items-center justify-center w-[50px] h-[50px] hover:cursor-pointer hover:scale-105 ease-in-out transition duration-200">
                    <WrenchScrewdriverIcon className="w-[100%] h-[100%" />
                  </div>
                </Menu.Button>
                <Menu.Items>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        className={`${active && "bg-blue-500"}`}
                        href="/account-settings"
                      >
                        Account settings
                      </a>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Menu> */}

              <div className="">
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button className="inline-flex w-full justify-center rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                      Board
                      <ChevronUpIcon
                        className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
                        aria-hidden="true"
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="z-[13] absolute right-0 translate-y-[-270px] w-56 origin-top-right rounded-md bg-[#0a0a0a] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none space-y-2 p-2">
                      <div className="px-2 py-2">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => setBoardStyle(icy_sea)}
                              className={`${
                                active
                                  ? "duration-200 ease-in-out transition bg-[white] text-[black]"
                                  : "text-[white]"
                              } group flex w-full items-center rounded-md px-2 py-2 text-[18px]`}
                            >
                              Icy Sea (Default)
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                      <div className="px-2 py-2">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => setBoardStyle(walnut)}
                              className={`${
                                active
                                  ? "duration-200 ease-in-out transition bg-[white] text-[black]"
                                  : "text-[white]"
                              } group flex w-full items-center rounded-md px-2 py-2 text-[18px]`}
                            >
                              Walnut
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                      <div className="px-2 py-2">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => setBoardStyle(tournament)}
                              className={`${
                                active
                                  ? "duration-200 ease-in-out transition bg-[white] text-[black]"
                                  : "text-[white]"
                              } group flex w-full items-center rounded-md px-2 py-2 text-[18px]`}
                            >
                              Tournament
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          )}
        </div>
        <div>
          {/* <div className="w-[30px] h-[470px] border border-[#242424] bg-[#0a0a0a]">
          <div className={`w-[100%] h-[${470 * (whiteEval/(whiteEval + blackEval))}px] bg-[white]`}>

          </div>
        </div> */}
        </div>
      </div>
    </div>
  );
}