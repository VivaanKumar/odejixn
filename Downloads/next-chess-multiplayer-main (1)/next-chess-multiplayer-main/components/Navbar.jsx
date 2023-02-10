import {
  Cog6ToothIcon,
  HomeIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import React, { useContext } from "react";

export default function Navbar({ context }) {
  const [user, setUser] = useContext(context).user;

  return (
    <div className="flex w-[65%] h-[70px] navbar justify-between items-center">
      {/* <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.location.pathname = "/"}> */}
      <HomeIcon
        onClick={() => {
          if (typeof window !== "undefined") {
            window.location.href = "/deck";
          }
        }}
        className="text-[white] w-8 h-8 cursor-pointer"
      />
      <h1 className="text-[38px] text-[#232323] font-extralight">KGV Chess</h1>
      {/* <InformationCircleIcon className="text-[white] w-8 h-8" />
        <Cog6ToothIcon className="text-[white] w-8 h-8" /> */}
      {/* </div> */}
      <img
        src={user?.photoURL}
        className="w-10 h-10 rounded-[12px] bg-[white]"
      />
    </div>
  );
}
