import {
  Cog6ToothIcon,
  CogIcon,
} from "@heroicons/react/24/outline";
import { ArrowsPointingInIcon, InformationCircleIcon, XMarkIcon } from "@heroicons/react/24/solid"
import { Cog8ToothIcon, HomeIcon, } from "@heroicons/react/24/solid";
import Image from "next/image";
import React, { useContext, useState } from "react";
import logo from "../public/logo.png";

export default function Navbar({ context }) {
  const [user, setUser] = useContext(context).user;

  const [warning, setWarning] = useState(typeof window !== 'undefined' && (localStorage.getItem("warning") ? localStorage.getItem("warning") : false));

  return (
    <>
    {/* <div className="bg-[white] text-black p-2 rounded-[12px] shadow-xl cursor-move absolute right-[4px]">
      <p>Admin Cheats On</p>
    </div> */}
      <div className="w-[70px] h-[98vh] absolute left-0 top-0 z-[30] ml-1 mt-[1vh]">
        {/* <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.location.pathname = "/"}> */}
        <div className="w-[100%] h-[100%] bg-gradient-to-t bg-[#0a0a0a] border rounded-[8px] border-[#1d1d1d] flex flex-col items-center justify-between py-[1.85rem] pb-0">
          <div onClick={() => {
            if (typeof window !== "undefined") {
              window.location.href = "/deck";
            }
          }} className="flex items-center flex-col justify-center space-y-[1.85rem] cursor-pointer">
            {/* <HomeIcon
              className="text-blue-500 w-9 h-9` cursor-pointer"
            /> */}
            <img src={logo.src} className="w-[30px] h-11" />
            {/* <p className="font-600">Home</p> */}

            <div className="flex flex-col gap-[0.95rem] items-center bg-[#17161663] p-[10px] py-[14px] rounded-[8px]">
            <ArrowsPointingInIcon onClick={() => {

              var elem = document.documentElement;
              if (elem.requestFullscreen) {
                elem.requestFullscreen();
              } else if (elem.webkitRequestFullscreen) { /* Safari */
                elem.webkitRequestFullscreen();
              } else if (elem.msRequestFullscreen) { /* IE11 */
                elem.msRequestFullscreen();
              }
            }} className="w-7 h-7 cursor-pointer text-[#b3b7bb]" />
            <hr className="w-[100%] h-[1px] bg-[#212121] border-none rounded-l-full"/>
            <InformationCircleIcon onClick={() => alert('Coming soon')} className="w-7 h-7 cursor-pointer text-[#b3b7bb]" />
            <hr className="w-[100%] h-[1px] bg-[#212121] border-none rounded-l-full"/>
            <Cog8ToothIcon onClick={() => alert('Coming soon')} className="w-7 h-7 cursor-pointer text-[#b3b7bb]" />
          </div>
          </div>
          
          {/* <InformationCircleIcon className="text-[white] w-8 h-8" />
        <Cog6ToothIcon className="text-[white] w-8 h-8" /> */}
          {/* </div> */}

          <div className="w-[100%] h-[fit] py-[0.925rem] flex items-center justify-center bg-[#1818187e] border-t rounded-t-[5px] border-[#1d1d1d]">
            <img
              src={user?.photoURL}
              className="w-10 h-10 rounded-full bg-[white] border-[2px] border-[white]"
            />
          </div>
        </div>

      </div>

      {/* {!warning && <div className="bottom-0 absolute">
        <div className="bg-red-500 z-[20] w-[100vw] h-[40px] p-1 flex items-center justify-center border-t border-red-600 space-x-2">
          <p>Maintaining KGV Chess requires lots server space - please be aware of unexpected downtimes</p>
          <XMarkIcon onClick={() => { setWarning(true); if(typeof window !== 'undefined')localStorage.setItem("warning", true) }} className="w-8 h-8 text-[white] cursor-pointer" />
        </div>
      </div>} */}
    </>
  );
}