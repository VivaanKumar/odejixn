"use client";

import Navbar from "components/Navbar";
import { db } from "../../../../firebase";
import { useRouter } from "next/navigation";
import React, { createContext, useState, useEffect, Fragment } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import {
  ArrowLongUpIcon,
  ArrowsUpDownIcon,
  BookOpenIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClockIcon,
  CursorArrowRippleIcon,
  FireIcon,
  LinkIcon,
  NoSymbolIcon,
  PaperClipIcon,
  PauseCircleIcon,
  PauseIcon,
  PencilIcon,
  PlayPauseIcon,
  WrenchScrewdriverIcon,
  XMarkIcon,
  XCircleIcon
} from "@heroicons/react/24/outline";

import { Switch } from '@headlessui/react'
// import data from "../../eco.json";
import { MegaphoneIcon, PaperAirplaneIcon, FlagIcon } from "@heroicons/react/24/solid";

import Moment from "react-moment";
import moment from "moment";
import { Menu, Transition } from "@headlessui/react";

import icy_sea from "../../../../public/icy_sea.png";
import walnut from "../../../../public/walnut.png";
import tournament from "../../../../public/tournament.png";

import green from "../../../../public/green.png";
import glass from "../../../../public/glass.png";
import burled_wood from "../../../../public/burled_wood.png";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from "next/head";

import { FadeIn } from "react-slide-fade-in";

const toastConif = {
  position: "top-center",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
}

const UserContext = createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const uid = localStorage.getItem("email")
      ? localStorage.getItem("email")
      : null;
    if (uid) {
      // console.log(uid);
      db.collection("users")
        .doc(uid)
        .get()
        .then((doc) => {
          if (!doc.exists) {
            router.push("/");
          }
          setUser(doc.data());
          // console.log(doc.data());
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
  const [enabled, setEnabled] = useState(false);
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

  const [animation, setAnimation] = useState(true);
  const [arrows, setArrows] = useState(true);

  const [spectating, setSpectating] = useState(false);


  const [fen, setFen] = useState(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  );
  const [allowed, setAllowed] = useState(true);
  const [waiting, setWaiting] = useState(true);
  const [state, setState] = useState(null);
  const [playingAgainst, setPlayingAgainst] = useState(null);
  const [ourUser, setOurUser] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [currentPlayer2, setCurrentPlayer2] = useState(null);

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
            // console.log(docc.data());
            db.collection("games")
              .doc(id)
              .onSnapshot((doc) => {
                const data = doc?.data();
                setEntireGame(data);
                const userEmail = docc.data()?.email;
                // console.log(doc.data());
                // console.log(doc?.data().creator, userEmail);

                if (doc.data().resigned) {
                  setState({
                    what: "Ended by resignation.",
                    user: `${doc.data().resigned} resigned.`,
                  });
                }

                if (data.members.length > 1) {
                  let theThing = data.members.filter((m) => m.white)[0].uid;
                  let theThing2 = data.members.filter((m) => m.black)[0].uid;

                  db.collection("users")
                    .doc(theThing2)
                    .get()
                    .then((p) => {
                      setCurrentPlayer2(p?.data());

                      console.log("black", p?.data());
                      // console.log(doccc?.data());
                    });


                  db.collection("users")
                    .doc(theThing)
                    .get()
                    .then((p) => {
                      setCurrentPlayer(p?.data());

                      console.log("white", p?.data());
                      // console.log(doccc?.data());
                    });
                }

                // console.

                // db.collection("users")
                //   .doc(theThing2)
                //   .get()
                //   .then((p) => {
                //     setCurrentPlayer2(p?.data());

                //     console.log("black", p?.data());
                //     // console.log(doccc?.data());
                //   });


                // db.collection("users")
                //   .doc(theThing)
                //   .get()
                //   .then((p) => {
                //     setCurrentPlayer(p?.data());

                //     console.log("white", p?.data());
                //     // console.log(doccc?.data());
                //   });
                // console.log("thingy", theThing);

                if (data.creator == userEmail) {
                  for (let i = 0; i < data.members.length; i++) {
                    // console.log(data.creator, data.members[i].white);
                    if (data.members[i].white == userEmail) {
                      // console.log("CREATOR = W");
                      setSide("w");
                      break;
                    } else {
                      // console.log("CREATOR = B");
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
                  console.log('damn 2');
                  db.collection("users")
                    .doc(data.creatorUid)
                    .get()
                    .then((doccc) => {
                      setPlayingAgainst(doccc?.data());
                      // console.log(doccc?.data());
                    });
                  if (data.members[0].white) {
                    console.log('damn 3');
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
                      setSpectating(true);
                      setSide("w");
                    }
                  }


                  if (data.members[0].black) {
                    console.log('wow');
                    if (
                      data.members.length <= 1 ||
                      data.members[1].white == userEmail ||
                      data.members[1].black == userEmail
                    ) {
                      if (data.members[0].black == userEmail) {
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
                      } else {
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
                      }
                    } else {
                      setSpectating(true);
                      setSide("w");
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

    // console.log("EVAL", whiteEval, blackEval);
    setWhiteEval(whiteEval);
    setBlackEval(blackEval);
  }, [game.fen()]);

  const [notShow, setNotShow] = useState(true);

  useEffect(() => {
    // console.log("the i d:", id);
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
        // console.log(doc?.data()?.members);
        if (doc?.data()?.members.length >= 2 && waiting == true) {
          setWaiting(false);
        }
        setFen(fen2);
        setState(null);
        setGame(new Chess(fen2));

        // console.log("fen,", fen2);
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
              live: false,
            });
          stopAllClocks();
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
              // console.log(otherUser.uid);
              db.collection("users")
                .doc(otherUser.uid)
                .get()
                .then((docccc) => {
                  setPlayingAgainst(docccc?.data());
                  // console.log(docccc?.data());
                });
            } else if (otherUser.black) {
              // console.log(otherUser.uid);
              db.collection("users")
                .doc(otherUser.uid)
                .get()
                .then((docccc) => {
                  setPlayingAgainst(docccc?.data());
                  // console.log(docccc?.data());
                });
            }
          }
        });
    }
  }, [ourUser, fen, game]);

  const [premove, setPremove] = useState({});

  useEffect(() => {
    if (!("Notification" in window)) {
      // console.log("Browser does not support desktop notification");
    } else {
      Notification.requestPermission();
    }
  }, []);

  function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  useEffect(() => {
    if (entireGame?.blackTime?.seconds && entireGame?.whiteTime?.seconds) {
      // alert('fixed a bug');
      console.warn("A bug has occured. KGV Chess is trying to fix it.");

      if (entireGame?.ticking == "w") {
        const toChange = entireGame?.blackTime;
        let a = moment(toChange.toDate())
        let b = moment(new Date())

        db.collection("games").doc(id).update({
          blackTime: "ST" + moment(a.diff(b)).format("mm:ss"),
        });
      } else {
        const toChange = entireGame?.whiteTime;
        let a = moment(toChange.toDate())
        let b = moment(new Date())

        db.collection("games").doc(id).update({
          whiteTime: "ST" + moment(a.diff(b)).format("mm:ss"),
        });
      }
    }
  }, [entireGame]);

  useEffect(() => {

  })


  useEffect(() => {
    if (Object.keys(premove).length !== 0 && entireGame?.ticking == side) {
      // console.log(premove)
      // delay(1000).then(() => {
      dropPiece(premove.sourceSquare, premove.targetSquare, premove.piece, "PREMOVE");

      ;

      setPremove({});
      //
      // });

    }
  }, [entireGame?.fen])

  const [boardResize, setBoardResize] = useState(540);

  useEffect(() => {
    if (!arrows) {
      setPremove(false);
      resetPremoveTiles();
    }
  }, [arrows])

  function resetPremoveTiles() {
    let getAllSquares = document.querySelectorAll('[data-square]');

    for (let i = 0; i < getAllSquares.length; i++) {
      getAllSquares[i].style.backgroundColor = "";
    }
  }

  function dropPiece(sourceSquare, targetSquare, piece, by) {
    const oldFen = game.fen();
    // console.log(piece.charAt(0) == side, !waiting);
    // console.log("3", by);

    if (piece.charAt(0) == side && (entireGame?.ticking ? entireGame?.ticking : "w") !== side && arrows) {
      setPremove({ sourceSquare, targetSquare, piece });

      resetPremoveTiles();


      const premovedTo = document.querySelector(`[data-square="${targetSquare}"]`);

      premovedTo.style.backgroundColor = "rgba(255, 0, 0, 0.45)";

      console.log(premovedTo);

      const premovedFrom = document.querySelector(`[data-square="${sourceSquare}"]`);

      premovedFrom.style.backgroundColor = "rgba(255, 0, 0, 0.45)";

      // console.log(premovedFrom);
      // console.log("2", by);
    }

    if (piece.charAt(0) == side && !waiting && (entireGame?.ticking ? entireGame?.ticking : "w") == side) {
      resetPremoveTiles();
      // console.log("1", by);
      const promotions = game
        .moves({ verbose: true })
        .filter((m) => m.promotion);
      let promotionTo = undefined;
      if (
        promotions.some(
          (p) => `${p.from}:${p.to}` == `${sourceSquare}:${targetSquare}`
        )
      ) {
        promotionTo = window.prompt(
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
          // alert(
          //   "You did not enter a valid promotion to, your pawn will automatically be promoted to a queen."
          // );
          alert("You did not enter a valid promotion to, your pawn will automatically be promoted to a queen.", toastConif);
          promotionTo = "q";
        }
      }

      let allPossibleMoves = game.moves({ verbose: true });

      let isValidMove = false;

      for (let i = 0; i < allPossibleMoves.length; i++) {
        if (allPossibleMoves[i].from == sourceSquare && allPossibleMoves[i].to == targetSquare) {
          isValidMove = true;
          break;
        }
      }

      if (isValidMove) {

        const legalMove = game.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: promotionTo,
        });

        // console.log("9", by);

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

        // console.log(oldFen);

        if (
          !(
            oldFen == "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
          )
        ) {
          let ourCurrentTime =
            side == "w" ? entireGame?.whiteTime : entireGame?.blackTime;
          // console.log(ourCurrentTime, by);

          // console.log(ourCurrentTime.toDate(), new Date());

          let a = ((by ? by : null) !== "PREMOVE" && moment(ourCurrentTime.toDate()))
          let b = ((by ? by : null) !== "PREMOVE" && moment(new Date()))

          // console.log(ourCurrentTime);

          // console.log(a, b);

          let time = (by ? by : null) == "PREMOVE" ? ourCurrentTime : "ST" + moment(a.diff(b)).format("mm:ss");

          // console.log("STOP to:", time);

          if (side == "w") {
            db.collection("games").doc(id).update({
              whiteTime: time,
            });
            // console.log("13", by);
          } else {
            db.collection("games").doc(id).update({
              blackTime: time,
            });
            // console.log("14", by);
          }
        }



        // console.log(myTime_mm, myTime_ss);

        if (!entireGame?.drawed || !game.isGameOver() || !entireGame?.timed) {
          db.collection("games").doc(id).update({
            fen: game.fen(),
            ticking: tickNext,

          });
          if (side == "w") {
            db.collection("games").doc(id).update({
              blackTime: newOtherDate,
            });
            // console.log("15", by);
          } else {
            db.collection("games").doc(id).update({
              whiteTime: newOtherDate,
            });
            // console.log("16", by);
          }
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

  const [sawNew, setSawNew] = useState(true);

  const [clockRotate, setClockRotate] = useState(0);



  // useEffect(() => {
  //   console.log("AAAA", game.history());
  // }, [game.fen()])

  function startTimer() {
    interval = setInterval(() => {
      setClockRotate(clockRotate + 90);
      // console.log(entireGame);
      if (entireGame?.whiteTime?.seconds) {
        if (entireGame?.whiteTime?.toDate() < new Date()) {
          db.collection("games")
            .doc(id)
            .update({
              whiteTime: "ST00:00",
              timed: side == "w" ? currentPlayer?.email : currentPlayer2?.email,
              loser: game.turn(),
              live: false,
            });
          // stopAllClocks();
        }
      }

      if (entireGame?.blackTime?.seconds) {
        if (entireGame?.blackTime?.toDate() < new Date()) {
          db.collection("games")
            .doc(id)
            .update({
              blackTime: "ST00:00",
              timed: side == "b" ? currentPlayer?.email : currentPlayer2?.email,
              loser: game.turn(),
              live: false,
            });
          // stopAllClocks();
        }
      }
    }, 1000);
  }

  useEffect(() => {
    db.collection("games")
      .doc(id)
      .collection("msg")
      .orderBy("timestamp", "desc")

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

  function highlight(square) {
    if (game.turn() !== side) return;
    let moves = game.moves({ square, verbose: true });
    // if(game.turn())
    if (moves.length !== 0) {
      moves.map((move) => {
        console.log(move);
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

  function stopAllClocks() {
    if (entireGame?.whiteTime?.seconds) {
      let a = moment(entireGame?.whiteTime?.toDate());
      let b = moment(new Date());

      let time = "ST" + moment(a.diff(b)).format("mm:ss");

      db.collection("games").doc(id).update({
        whiteTime: time,
      });
    }

    if (entireGame?.blackTime?.seconds) {
      let a = moment(entireGame?.blackTime?.toDate());
      let b = moment(new Date());

      let time = "ST" + moment(a.diff(b)).format("mm:ss");

      db.collection("games").doc(id).update({
        blackTime: time,
      });
    }
  }

  return (
    <div className="w-[100vw] h-[100vh] flex flex-col items-center flex-grow-1 p-4 space-y-4">
      <ToastContainer />
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

      <div className="h-[100%] w-[65%] flex justify-center items-center space-x-6 flex-row-reverse space-x-3">
        {side ? (
          //
          <div className="flex flex-col space-y-0 w-[250px] flex-grow-1 justify-start items-start backdrop-blur-md">
            <div className="flex flex-col space-y-[12px] items-start h-fit z-[100]">
              {!spectating ? <div className="w-[250px] flex items-center justify-center space-x-3"> {/** */}
                {!state && (
                  <>
                    <button
                      onClick={() => {
                        // if (typeof window !== "undefined") {
                        let confirm = typeof window !== "undefined" && window.confirm(
                          "Are you sure you want to resign? You will lose this match."
                        );
                        // }

                        if (confirm) {
                          setState({
                            what: "Ended by resignation.",
                            user: `${ourUser?.email} resigned.`,
                          });

                          db.collection("games").doc(id).update({
                            resigned: ourUser?.email,
                            live: false,
                            loser: game.turn(),
                          });

                          stopAllClocks();
                        }
                      }}
                      className="flex items-center gap-2 w-fit h-[50px] hover:scale-105 transition duration-200 ease-in-out"
                      title="Resign and lose the game."
                    >
                      Resign
                      <FlagIcon className="w-6 h-6 text-[white] text-[12px]" />
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

                              toast.info(
                                "You have asked for a draw!", toastConif
                              );
                            });
                        }}
                        className={`hover:scale-105 transition duration-200 ease-in-out flex h-[50px] text-[16px] items-center gap-2 text-[white] ${entireGame?.draw &&
                          "cursor-default brightness-[0.45] pointer-events-none"
                          }`}
                        title="Draw and split the win equally."
                      >
                        Draw <ArrowsUpDownIcon className="w-6 h-6" />
                      </button>
                    )}
                  </>
                )}
              </div> : (
                <button className="flex space-x-2 items-center bg-[#b23330] p-1 px-3 border-none pointer-events-none">
                  <img className="w-8 h-8" src="../../spectate.png" />
                  <p>Spectating</p>
                </button>
              )}
              {/** */}
              {/* {playingAgainst && <h1>Opponent:</h1>} */}
              <div className="flex items-center justify-center w-[250px]">
                {playingAgainst && (
                  <img
                    className="w-[48px] h-[48px] rounded-l-[12px] outline-none border-none rounded-b-none"
                    src={spectating ? currentPlayer2?.photoURL : playingAgainst?.photoURL}
                  />
                )}
                <div
                  className={`bg1 h-fit w-[202px] flex-col flex items-center justify-center text-[12px] text-[#9b9b9b] rounded-r-[12px] rounded-br-[0px] ${playingAgainst
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
                            toast.info("Copied to clipboard!", toastConif);
                          }
                        }}
                        className="h-[40px] flex items-center justify-center text-[16px] space-x-2 mt-2 bg-blue-500 border-none"
                      >
                        <LinkIcon className="w-6 h-6 text-[white]" />{" "}
                        <p className="text-[white]">Copy link</p>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {playingAgainst && (
              <>
                {/* <h1>Chat:</h1> */}

                <div className="w-[250px] bg-[#0a0a0a] border border-[#1a1a1a] p-[1rem]  h-[370px] flex-col rounded-b-[12px] flex justify-between items-center gap-2 mb-3">
                  <div className="h-[300px] w-[100%] overflow-auto scroll-smooth">
                    <FadeIn>
                      {messages.map((m) => (
                        <div
                          key={m.id}
                          className="flex flex-col border-t border-b p-[2px]  gap-[2px] h-fit border-[#1a1a1a] py-2"
                        >
                          <b>{m.data.user.substring(0, 16)}:</b>
                          <p>{m.data.cap}</p>
                          <div className="text-sm text-gray-500">
                            <Moment fromNow>{m.data.timestamp.toDate()}</Moment>
                          </div>
                        </div>
                      ))}
                    </FadeIn>
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
                      <div className="flex items-center">
                        <input
                          onChange={(e) => setCap(e.target.value)}
                          value={cap}
                          placeholder={spectating ? "Can't chat while spectating" : "Type a message..."}
                          className={`${spectating && "pointer-events-none"} text-[14px] w-[100%] h-[100%] bg-transparent p-2 rounded-[12px] hover:outline-none active:outline-none`}
                        />
                        {!spectating && <button type="submit" className="bg-none border-none">
                          <PaperAirplaneIcon className="w-6 h-6 text-[white]" />
                        </button>}
                      </div>
                    </form>
                  </div>
                </div>
                <div className="h-1"></div>
                {/* //g */}
                <div className="flex flex-col">
                  {/* <div className="flex items-center space-x-2"> */}
                  {!spectating && <div title="Allow the option to use premoves." className="space-x-2 flex items-center">

                    <Switch
                      checked={arrows}
                      onChange={setArrows}
                      // defaultChecked="T"
                      className={`scale-[0.7] ${arrows ? 'bg-[#3b82f6]' : 'bg-gray-600'}
          relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                    >
                      {/* <span className="sr-only">Use setting</span> */}
                      <span
                        aria-hidden="true"
                        className={`${arrows ? 'translate-x-[20.5px] translate-y-[-16px]' : 'translate-x-[-16px] translate-y-[-16px]'}
            pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                      />
                    </Switch>
                    <h1 className="flex items-center space-x-2"><h1>Premoves</h1>  <span className="text-red-600 font-bold">{Object.keys(premove).length !== 0 && `(${premove.sourceSquare} to: ${premove.targetSquare})`}</span></h1>
                  </div>}
                  <div title="Turn off piece move animations." className="space-x-2 flex items-center">

                    <Switch
                      checked={animation}
                      onChange={setAnimation}
                      // defaultChecked="T"
                      className={`scale-[0.7] ${animation ? 'bg-[#3b82f6]' : 'bg-gray-600'}
          relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                    >
                      {/* <span className="sr-only">Use setting</span> */}
                      <span
                        aria-hidden="true"
                        className={` ${animation ? 'translate-x-[20.5px] translate-y-[-16px]' : 'translate-x-[-16px] translate-y-[-16px]'}
            pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                      />
                    </Switch>
                    <h1>Animations</h1>
                  </div>


                </div>
                {/* </div> */}

              </>
            )}
          </div>

        ) : (
          <>
            {/* <h1>You are currently spectating this game as the game has already started between 2 players. You are not allowed to see the 2 opponent's usernames until the game finishes.</h1> */}
          </>
        )}

        <div className="w-[12px]"></div>

        <div className="space-y-3 mr-2">
          {playingAgainst && (
            <div className="flex items-center justify-between">
              <div className="flex">
                <img
                  className="w-[48px] h-[48px] rounded-l-[5px] outline-none border-none"
                  src={spectating ? currentPlayer2?.photoURL : playingAgainst?.photoURL}
                />
                <div
                  className={`h-[48px] rounded-r-[5px] flex items-center text-[20px] ${side !== entireGame?.ticking
                    ? "bg-gray-100 border border-gray-300 text-[black] p-[1rem]"
                    : "bg1 text-[#383838]"
                    }`}
                >
                  {(side == "w" ? entireGame?.blackTime : entireGame?.whiteTime)
                    .seconds ? (
                    <div className="flex items-center space-x-2">
                      <div className=""><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" style={{ transform: `rotate(${clockRotate}deg)` }}><path d="M5.48,9a.93.93,0,0,0-.3.71v.58a.94.94,0,0,0,.3.71,1,1,0,0,0,.71.3h4.58a1,1,0,0,0,.71-.3.94.94,0,0,0,.29-.71V9.7A.92.92,0,0,0,11.48,9a1,1,0,0,0-.71-.27H6.19A1,1,0,0,0,5.48,9Z"></path><path d="M19.22,6.1a9.9,9.9,0,0,0-2.14-3.18A10.23,10.23,0,0,0,13.9.78,9.76,9.76,0,0,0,10,0,9.86,9.86,0,0,0,6.1.78,10,10,0,0,0,.78,6.1,9.81,9.81,0,0,0,0,10a9.81,9.81,0,0,0,.78,3.9A10,10,0,0,0,6.1,19.22,9.86,9.86,0,0,0,10,20a9.76,9.76,0,0,0,3.89-.78,10.23,10.23,0,0,0,3.18-2.14,9.9,9.9,0,0,0,2.14-3.18A9.81,9.81,0,0,0,20,10,9.81,9.81,0,0,0,19.22,6.1ZM17.07,13a7.65,7.65,0,0,1-1.65,2.42A7.81,7.81,0,0,1,13,17.06a7.46,7.46,0,0,1-3,.6,7.51,7.51,0,0,1-3-.6,7.74,7.74,0,0,1-2.43-1.65A8,8,0,0,1,2.94,13a7.46,7.46,0,0,1-.6-3,7.46,7.46,0,0,1,.6-3A8,8,0,0,1,4.58,4.59,7.74,7.74,0,0,1,7,2.94a7.51,7.51,0,0,1,3-.6,7.45,7.45,0,0,1,3,.6,7.74,7.74,0,0,1,2.43,1.65A7.65,7.65,0,0,1,17.07,7a7.46,7.46,0,0,1,.6,3A7.46,7.46,0,0,1,17.07,13Z"></path></svg></div>
                      <Moment
                        interval={1_000}
                        filter={(d) => d.replaceAll("-", "")}
                        durationFromNow
                        format="mm:ss"
                      // trim
                      >
                        {(side == "w"
                          ? entireGame?.blackTime
                          : entireGame?.whiteTime
                        ).toDate()}
                      </Moment>
                    </div>
                  ) : (
                    <p className="flex items-center">
                      {/* <PauseCircleIcon className="w-6 h-6 mr-2" /> */}
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

              {entireGame?.draw && entireGame?.draw !== ourUser?.email && !spectating && (

                <div className="">
                  <div className="flex w-[fit] space-x-2 gap-2 h-fit justify-between  items-center rounded-[12px] p-[2px]">
                    <p className="text-gray-500 text-[18px]">Opponent asked Draw?</p>

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
                          live: false,
                          loser: game.turn(),
                        });

                        stopAllClocks();
                        setState({
                          what: "Draw",
                          user: "Both players have agreed to a draw",
                        });
                      }}
                    >
                      <CheckIcon className="w-7 h-7" />
                    </button>
                  </div>
                </div>

                // </div>
              )}

              {entireGame?.draw && entireGame?.draw == ourUser?.email && !spectating && <div className="flex items-center space-x-2">

                <p className="text-gray-600 hover:underline cursor-pointer">
                  {entireGame?.draw && (entireGame?.draw == ourUser?.email ? <span onClick={() => {
                    db.collection("games").doc(id).update({
                      draw: null,
                    })
                  }} className="flex space-x-2 items-center"><span>You have requested a draw</span> <XMarkIcon className="w-5 h-5" /></span> : (spectating && "Draw has been requested by " + entireGame?.draw.substring(0, 7) + "..."))}
                </p>
              </div>}
            </div>
          )}

          <FadeIn>
            <div className={`${spectating && "pointer-events-none"}`}>
              <Chessboard
                onSquareRightClick={() => { setPremove({}); resetPremoveTiles() }}
                // arePremovesAllowed={true}
                // clearPremovesOnRightClick
                boardWidth={boardResize}
                position={fen}

                onMouseOverSquare={highlight}
                onMouseOutSquare={dehighlight}

                onPieceDrop={dropPiece}
                animationDuration={animation ? 300 : 0}
                areArrowsAllowed={arrows}
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
              <FadeIn>
              {state && notShow && (
                <div className="absolute translate-y-[-540px] z-[20] w-[540px] h-[540px]">
                  <div className="w-[100%] h-[100%] grid place-content-center">
                    <div className="flex items-center justify-center p-6 z-[10] text-center w-[350px] h-[350px] bg-[#0000006f] shadow-2xl rounded-[12px] backdrop-blur-[10px]">
                      <div className="absolute translate-x-[-150px] translate-y-[-150px]">
                        <XMarkIcon onClick={() => setNotShow(false
                          )} className="w-7 h-7 text-[white] cursor-pointer" />
                      </div>
                      <div className="h-[100%] w-[100%] grid place-content-center text-white">
                        <h1 className="text-[36px] font-bold">{state?.what}</h1>
                        <h1 className="text-[24px]">{state?.user}</h1>
                        <p>This game has ended.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              </FadeIn>

              {/* {style && (
              <div className="z-[11] w-[430px] h-[430px] absolute translate-y-[-470px] scale-[1] bg-[#0a0a0a] p-6">
                <div className="bg1">Icy Sea (Default)</div>
              </div>
            )} */}
            </div>
          </FadeIn>

          {playingAgainst && (
            <div className="flex items-center justify-between">
              <div className="flex">
                <img
                  className="w-[48px] h-[48px] rounded-l-[5px] outline-none border-none"
                  src={spectating ? currentPlayer?.photoURL : ourUser?.photoURL}
                />
                <div
                  className={`h-[48px] rounded-r-[5px] flex items-center text-[20px] ${side == entireGame?.ticking
                    ? "bg-gray-100 border border-gray-300 text-[black] p-[1rem]"
                    : "bg1"
                    }`}
                >
                  {(side == "w" ? entireGame?.whiteTime : entireGame?.blackTime)
                    .seconds ? (
                    <div className="flex items-center space-x-2">
                      <div className=""><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" style={{ transform: `rotate(${clockRotate}deg)` }}><path d="M5.48,9a.93.93,0,0,0-.3.71v.58a.94.94,0,0,0,.3.71,1,1,0,0,0,.71.3h4.58a1,1,0,0,0,.71-.3.94.94,0,0,0,.29-.71V9.7A.92.92,0,0,0,11.48,9a1,1,0,0,0-.71-.27H6.19A1,1,0,0,0,5.48,9Z"></path><path d="M19.22,6.1a9.9,9.9,0,0,0-2.14-3.18A10.23,10.23,0,0,0,13.9.78,9.76,9.76,0,0,0,10,0,9.86,9.86,0,0,0,6.1.78,10,10,0,0,0,.78,6.1,9.81,9.81,0,0,0,0,10a9.81,9.81,0,0,0,.78,3.9A10,10,0,0,0,6.1,19.22,9.86,9.86,0,0,0,10,20a9.76,9.76,0,0,0,3.89-.78,10.23,10.23,0,0,0,3.18-2.14,9.9,9.9,0,0,0,2.14-3.18A9.81,9.81,0,0,0,20,10,9.81,9.81,0,0,0,19.22,6.1ZM17.07,13a7.65,7.65,0,0,1-1.65,2.42A7.81,7.81,0,0,1,13,17.06a7.46,7.46,0,0,1-3,.6,7.51,7.51,0,0,1-3-.6,7.74,7.74,0,0,1-2.43-1.65A8,8,0,0,1,2.94,13a7.46,7.46,0,0,1-.6-3,7.46,7.46,0,0,1,.6-3A8,8,0,0,1,4.58,4.59,7.74,7.74,0,0,1,7,2.94a7.51,7.51,0,0,1,3-.6,7.45,7.45,0,0,1,3,.6,7.74,7.74,0,0,1,2.43,1.65A7.65,7.65,0,0,1,17.07,7a7.46,7.46,0,0,1,.6,3A7.46,7.46,0,0,1,17.07,13Z"></path></svg></div>

                      <Moment
                        interval={1_000}
                        filter={(d) => d.replaceAll("-", "")}
                        durationFromNow
                        format="mm:ss"
                      // trim
                      >
                        {(side == "w"
                          ? entireGame?.whiteTime
                          : entireGame?.blackTime
                        ).toDate()}
                        {/* {console.log("THE FUCKING TIME, ", (side == "w"
                      ? entireGame?.whiteTime
                      : entireGame?.blackTime) )} */}
                      </Moment>
                    </div>
                  ) : (
                    <p className="flex items-center">
                      {/* <PauseCircleIcon className="w-6 h-6 mr-2" /> */}
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

              <div className="flex items-center space-x-4">

                <div title="Send this link to other people to spectate the game." className=" cursor-pointer ml-2 flex items-center space-x-2" onClick={() => {
                  if (typeof window !== "undefined") {
                    navigator.clipboard.writeText(window.location.href);
                    toast.info("Copied to clipboard!", toastConif);
                  }
                }}>
                  <LinkIcon className="w-6 h-6" />
                  <p className="hover:underline">Spectate Link</p>
                </div>

                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    {sawNew && <div className="absolute w-[fit] translate-x-[80px] translate-y-[-10px] h-[fit] bg-red-600 text-[white] rounded-[5px] z-[30] p-[2px] text-[12px]">New</div>}
                    <Menu.Button onClick={() => setSawNew(false)} className="inline-flex w-full justify-center rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
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
                    <Menu.Items className="z-[13] absolute right-0 translate-y-[-476px] w-56 origin-top-right rounded-md bg-[#0a0a0a] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none space-y-2 p-2">
                      <div className="px-2 py-2">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => setBoardStyle(icy_sea)}
                              className={`${active
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
                              onClick={() => setBoardStyle(green)}
                              className={`${active
                                ? "duration-200 ease-in-out transition bg-[white] text-[black]"
                                : "text-[white]"
                                } group flex w-full items-center rounded-md px-2 py-2 text-[18px]`}
                            >
                              Green Neon
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                      <div className="px-2 py-2">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => setBoardStyle(glass)}
                              className={`${active
                                ? "duration-200 ease-in-out transition bg-[white] text-[black]"
                                : "text-[white]"
                                } group flex w-full items-center rounded-md px-2 py-2 text-[18px]`}
                            >
                              Glass
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                      <div className="px-2 py-2">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => setBoardStyle(burled_wood)}
                              className={`${active
                                ? "duration-200 ease-in-out transition bg-[white] text-[black]"
                                : "text-[white]"
                                } group flex w-full items-center rounded-md px-2 py-2 text-[18px]`}
                            >
                              Burled Wood
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                      <div className="px-2 py-2">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => setBoardStyle(walnut)}
                              className={`${active
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
                              className={`${active
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
    </div >
  );
}