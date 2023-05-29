"use client";

import {
  BellIcon,
  EllipsisHorizontalCircleIcon,
  HomeIcon,
  UserIcon,
  // HomeIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Toaster, toast } from "react-hot-toast";
import useSWR from "swr";
import "./globals.css";
import { Poppins } from "next/font/google";
import { Suspense, createContext, useEffect, useState } from "react";
import Button from "@/components/Button";
import {
  HomeIcon as HomeIconB,
  UserIcon as UserIconB,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import Loading from "@/components/Loading";
import { useRouter, usePathname } from "next/navigation";

import PostModal from "@/components/PostModal";
import { HomeModernIcon } from "@heroicons/react/24/solid";
import CommentModal from "@/components/CommentModal";

const font = Poppins({ subsets: ["latin"], weight: "500" });

const fetcher = (url: any) => fetch(url).then((r) => r.json());

const MAIN_WIDTH = 700;

export const RootContext = createContext<any>(null);

export type User = {
  name: string;
  username: string;
  createdAt: Date;
  lastSeen: Date;
  email: string;
  photoURL: string | null;
  bio: string;
  _id: string;
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [allUsers, setAllUsers] = useState<any>(null);

  const [postModal, setPostModal] = useState(false);
  const [commentModal, setCommentModal] = useState(null);

  const { data, error, isLoading } = useSWR(
    typeof window !== "undefined"
      ? `/api/getUser?email=${localStorage.getItem("id")}`
      : ``,
    fetcher
  );

  const { data: data1 } = useSWR(
    typeof window !== "undefined" ? `/api/getAllUsers?limit=${5}` : ``,
    fetcher
  );

  useEffect(() => {
    console.log(data1);
    setAllUsers(data1);
  }, [data1]);

  useEffect(() => {
    setUser(data);
    console.log(data);
  }, [data]);

  return (
    <RootContext.Provider
      value={{
        user: [user, setUser],
        postModal: [postModal, setPostModal],
        commentModal: [commentModal, setCommentModal],
      }}
    >
      <html lang="en">
        <body className={font.className}>
          <div className={`w-[calc((100vw-600px)*0.5)] h-screen p-8`}>
            <PostModal />
            <CommentModal />
            <Toaster />
            <div className="flex flex-col h-full justify-between items-end">
              <></>
              <div className="flex flex-col space-y-2 items-end">
                <div className="icon px-4 py-3 items-center flex space-x-4 w-[250px]">
                  {pathname == "/" ? (
                    <HomeIconB className="w-7 h-7" />
                  ) : (
                    <HomeIcon className="w-7 h-7" />
                  )}
                  <h1 className="text-xl">Home</h1>
                </div>
                <div
                  onClick={() => router.push(`/user/${user?.email}`)}
                  className="icon px-4 py-3 items-center flex space-x-4 w-[250px]"
                >
                  {pathname == "/" ? (
                    <UserIcon className="w-7 h-7" />
                  ) : (
                    <UserIconB className="w-7 h-7" />
                  )}
                  <h1 className="text-xl">User</h1>
                </div>
                <div
                  onClick={() => {
                    toast("Coming soon", {
                      icon: <XMarkIcon className="w-6 h-6 text-white" />,
                      style: {
                        borderRadius: "100px",
                        background: "#8544ef",
                        color: "#fff",
                      },
                    });
                  }}
                  className="icon p-4 py-3 items-center flex space-x-4 w-[250px]"
                >
                  <BellIcon className="w-7 h-7" />
                  <h1 className="text-xl">Notifications</h1>
                </div>

                <Button />
              </div>

              {user && (
                <div onClick={() => router.push(`/user/${user?.email}`)} className="w-[250px] icon items-center flex space-x-4">
                  <Image
                    className="rounded-full"
                    src={user?.photoURL as string}
                    height={50}
                    width={50}
                    alt="User Image"
                  />
                  <div className="flex flex-col">
                    <h1>{user?.name?.substring(0, 12)}</h1>
                    <p className="text-neutral-500 text-sm">
                      @{user?.username?.toLowerCase()?.substring(0, 12)}
                    </p>
                  </div>
                  <EllipsisHorizontalCircleIcon className="w-6 h-6 text-neutral-500" />
                </div>
              )}
            </div>
          </div>
          <div className="w-[600px] noScrollbar h-screen overflow-auto border-x border-neutral-200">
            <Suspense>{children}</Suspense>
            <div className="h-[160px]"></div>
          </div>
          <div
            className={`w-[calc((100vw-600px)*0.5)] flex flex-col space-y-2 h-screen p-8`}
          >
            <div className="p-4 bg-neutral-100 rounded-xl flex flex-col space-y-2">
              <h1 className="text-xl">Best reviewers</h1>
              <div className="flex flex-col space-y-2">
                <Suspense>
                  {allUsers?.map((u: User) => (
                    <div
                      key={u?._id}
                      onClick={() => router.push(`/user/${u?.email}`)}
                      className="flex space-x-2 items-center p-1 px-2 rounded-xl transition duration-200 ease-out cursor-pointer hover:bg-neutral-200"
                    >
                      <Image
                        className="w-10 h-10 rounded-full"
                        alt="User Image"
                        width={40}
                        height={40}
                        src={u?.photoURL as string}
                      />
                      <div className="flex flex-col">
                        <h1>{u?.name}</h1>
                        <p className="text-sm text-neutral-600">
                          @{u?.username}
                        </p>
                      </div>
                    </div>
                  ))}
                </Suspense>
              </div>
            </div>
          </div>
        </body>
      </html>
    </RootContext.Provider>
  );
}
