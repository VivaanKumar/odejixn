import React, { Fragment, useContext, useState } from "react";

import {
  AcademicCapIcon,
  ArrowsRightLeftIcon,
  CpuChipIcon,
  EyeIcon,
  LinkIcon,
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  PlusIcon,
  PuzzlePieceIcon,
  QuestionMarkCircleIcon,
  UserIcon,
  UsersIcon,
  ViewfinderCircleIcon,
  WifiIcon,
} from "@heroicons/react/24/solid";

import { v4 as uuidv4 } from "uuid";
import { db } from "../firebase";
import { useRouter } from "next/navigation";
import { Dialog, Transition } from "@headlessui/react";

export default function Button({ context }) {
  const [user, setUser] = useContext(context).user;
  const [statusInfo, setStatusInfo] = useState("");
  const [playsAs, setPlaysAs] = useState("w");
  const [time, setTime] = useState("");
  const router = useRouter();
  const [request, setRequest] = useState("");
  const createGame = () => {

    const min = time;
    const play = playsAs;

    if (min < 1 || min > 60 || min % 1 !== 0 || !min) {
      alert("Please enter a non-decimal time between 1 and 60 minutes.");
      return;
    }

    if (!play) {
      alert("Pick a side to play as.");
    }

    closeModal();
    setStatusInfo("Creating Game...");
    const id = uuidv4();


    if (play == "w") {
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
          live: true,
          gameCreatedAt: new Date(),
        })
        .then(() => {
          if (typeof window !== "undefined") {
            window.location.pathname = `/games/${id}`;
          }
          setStatusInfo("Redirecting...");
        });
    } else {
      db.collection("games")
        .doc(id)
        .set({
          creator: user?.email,
          creatorUid: localStorage.getItem("email"),
          members: [{ black: user?.email, uid: localStorage.getItem("email") }],
          started: false,
          fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
          ticking: "w",
          live: true,
          blackTime: `ST${min}:00`,
          whiteTime: `ST${min}:00`,
          gameCreatedAt: new Date(),
        })
        .then(() => {
          if (typeof window !== "undefined") {
            window.location.pathname = `/games/${id}`;
          }
          setStatusInfo("Redirecting...");
        });
    }
  };


  let [isOpen, setIsOpen] = useState(false)
  let [isOpen2, setIsOpen2] = useState(false)

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  function closeModal2() {
    setIsOpen2(false)
  }

  function openModal2() {
    setIsOpen2(true)
  }

  return (
    <>
      {statusInfo && (
        <div className="w-[100vw] h-[100vh] bg-[#00000088] absolute inset-0 z-10">
          <div className="w-[100%] h-[100%] flex items-center justify-center text-[40px]">
            {statusInfo}
          </div>
        </div>
      )}

      {/* <button className=" brightness-[0.45] flex items-center space-x-2 w-[300px] transition duration-200 ease-in-out hover:scale-105">
        <MagnifyingGlassIcon className="w-7 h-7 text-[white]" />
        <p
          onClick={() => {
            router.push("/");
          }}
          className="text-[#9b9b9b] text-[15px]"
        >
          Search games (Coming 29th Feb)
        </p>
      </button> */}
      <button
        onClick={() => window.location.href = "/recent-games"}
        className="z-[30] flex items-center space-x-2 transition duration-200 ease-in-out hover:scale-105"
      >
        <EyeIcon className="w-7 h-7 text-[white]" />
        {/* <img src="./spectate.png" className="w-7 h-7"/> */}
        <p className="text-[#9b9b9b]">Recent Games</p>
        <div className={`flex items-center space-x-2 absolute bg-[#b23330] text-[white] p-[2px] px-1 rounded-[5px] translate-x-[173px] translate-y-[-30px] z-50 shadow-md`}>
        <p>Live</p>
          <WifiIcon className="w-5 h-5"/>
        </div>
      </button>
      <button
        onClick={openModal}
        className="flex items-center space-x-2 transition duration-200 ease-in-out hover:scale-105"
      >
        <LinkIcon className="w-7 h-7 text-[white]" />
        <p className="text-[#9b9b9b]">Create Game With Link</p>
      </button>
      <button
        onClick={() => window.location.href = "/puzzle"}
        className="flex items-center space-x-2 transition duration-200 ease-in-out hover:scale-105"
      >
        <PuzzlePieceIcon className="w-7 h-7 text-[white]" />
        <p className="text-[#9b9b9b]">Learn Puzzles</p>
      </button>
      <button
        onClick={openModal2}
        className="flex items-center space-x-2 transition duration-200 ease-in-out hover:scale-105"
      >
        <QuestionMarkCircleIcon className="w-7 h-7 text-[white]" />
        <p className="text-[#9b9b9b]">Update Request</p>
      </button>
      {/* <button onClick={() => window.location.href "/board")} className="flex items-center space-x-2 transition duration-200 ease-in-out hover:scale-105">
        <ArrowsRightLeftIcon className="w-7 h-7 text-[white]" />
        <p className="text-[#9b9b9b]">Over the board</p>
      </button> */}

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[100]" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-[0.7]" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#0a0a0a] border border-[#1a1a1a] p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-medium leading-6 text-gray-900 text-[28px]"
                  >
                    <p className="text-[28px] text-[white]">
                      Setup Game
                    </p>
                  </Dialog.Title>
                  <div className="mt-4  space-y-2">
                    <p className="text-sm text-gray-500">
                      Clock Time (m)
                    </p>
                    <input onChange={(e) => setTime(e.target.value)} type="number" placeholder={"Enter minutes"} className="text-[white] w-[100%] p-2 outline-none hover:outline-none active:outline-none bg-transparent border border-gray-200 rounded-[5px]" />
                  </div>

                  <div className="mt-4  space-y-2">
                    <p className="text-sm text-gray-500">
                      I Play As Color:
                    </p>
                    <div className="flex space-x-4 items-center">
                      <div onClick={() => setPlaysAs("w")} title="White" className={`${playsAs == "w" && " border-[4px] border-blue-500"} bg-[white] w-[60px] h-[60px] border rounded-[5px] cursor-pointer flex items-center justify-center`}>
                        <UserIcon className="w-8 h-8 text-[black]" />
                      </div>

                      <div onClick={() => setPlaysAs("b")} title="Black" className={`${playsAs == "b" && " border-[4px] border-blue-500"} w-[60px] h-[60px] border rounded-[5px] bg-black cursor-pointer flex items-center justify-center`}>
                        <UserIcon className="w-8 h-8 text-[white]" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      onClick={() => createGame()}
                      type="button"
                      className="inline-flex items-center space-x-2 justify-center rounded-md border border-transparent bg-blue-500 px-2 py-2 text-sm font-medium text-white transition duration-200 ease-in-out hover:scale-105"
                    // onClick={closeModal}
                    >
                      <PlusIcon className="w-6 h-6" />
                      <p>Create Game</p>
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={isOpen2} as={Fragment}>
        <Dialog as="div" className="relative z-[100]" onClose={closeModal2}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-[0.7]" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#0a0a0a] border border-[#1a1a1a] p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-medium leading-6 text-gray-900 text-[28px]"
                  >
                    <p className="text-[28px] text-[white]">
                      Request to Developer
                    </p>
                  </Dialog.Title>
                  <div className="mt-4  space-y-2">
                    <p className="text-sm text-gray-500">
                      Ask the developer to add a specific feature
                    </p>
                    <textarea onChange={(e) => setRequest(e.target.value)} placeholder="Add your requested feature here" className="w-[100%] h-[200px] resize-none outline-none hover:outline-none active:outline-none p-2 rounded-[12px] bg-[#151515]"></textarea>
                    {/* <input onChange={(e) => setTime(e.target.value)} type="number" placeholder={"Enter minutes"} className="text-[white] w-[100%] p-2 outline-none hover:outline-none active:outline-none bg-transparent border border-gray-200 rounded-[5px]" /> */}
                  </div>

                  

                  <div className="mt-4">
                    <button
                      onClick={() => {
                        if(request) {
                          db.collection("requests").doc().set({
                            email: user?.email ? user?.email : "Email corrupted",
                            request,
                          }).then(() => {
                            closeModal2();
                            alert("Request sent");
                          })
                        }
                      }}
                      type="button"
                      className="inline-flex items-center space-x-2 justify-center rounded-md border border-transparent bg-blue-500 px-2 py-2 text-sm font-medium text-white transition duration-200 ease-in-out hover:scale-105"
                    // onClick={closeModal}
                    >
                      <PaperAirplaneIcon className="w-6 h-6" />
                      <p>Send Request</p>
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
