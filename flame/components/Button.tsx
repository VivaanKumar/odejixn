"use client";

import { RootContext, User } from "@/app/layout";
import { auth, googleProvider } from "@/firebase";
import { UserCredential, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";

function Button({}) {
  const router = useRouter();
  async function fetchPostUser(user: any) {
    const res = await fetch(
      `/api/createUser?email=${user?.email}&name=${user?.displayName}&photoURL=${user?.photoURL}`
    );

    return res.json();
  }
  const [user, setUser] = useContext(RootContext).user;
  const [postModal, setPostModal] = useContext(RootContext).postModal;
  
  const click = async () => {
    if (user) {
      setPostModal(true);
    } else {
      signInWithPopup(auth, googleProvider).then(
        async (data: UserCredential) => {
          const user = data?.user;

          const userFetched: any = await fetchPostUser(user);

          if (userFetched.success) {
            if(typeof window !== "undefined") localStorage.setItem("id", user?.email as string);
            router.refresh();
            
          }
        }
      );
    }
  };
  return (
    <div
      onClick={() => click()}
      className="w-[250px] hoverButton flex items-center text-xl justify-center from-primary to-secondary bg-gradient-to-r text-white rounded-full p-4 py-3 cursor-pointer hover:bg-primary hover:bg-opacity-80"
    >
      {user ? "Review" : "Sign In"}
    </div>
  );
}

export default Button;
