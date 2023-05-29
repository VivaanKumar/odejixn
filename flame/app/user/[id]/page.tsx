"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Head from "@/components/Head";
import useSWR from "swr";
import { ArrowLeftIcon, FlagIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
type Props = {};

const fetcher = (url: any) => fetch(url).then((r) => r.json());

function Page({}: Props) {
  const params: any = useParams()?.id;

  const router = useRouter();

  const { data, error, isLoading } = useSWR(
    typeof window !== "undefined" ? `/api/getUser?email=${params}` : ``,
    fetcher
  );

  console.log(data)
  return (
    <div className="w-full">
      <Head
        label={
          <>
            <div className="flex w-full p-4 h-14">
              <div className="text-xl translate-x-[-8px] w-full flex space-x-2 items-center">
                <div onClick={() => router.push("/")} className="icon">
                  <ArrowLeftIcon className="w-6 h-6" />
                </div>
                <h1>{data?.email || "Post"}</h1>
              </div>
              <div className="w-full flex items-center justify-between">
                <h1 className="text-xl"></h1>
                {/* <div className="icon  translate-x-2">
                  <SparklesIcon className="w-6 h-6" />
                </div> */}
              </div>
            </div>
          </>
        }
      />
      <div className="h-[55px]"></div>
      <div className="w-full h-[240px] bg-neutral-300 p-4"></div>
      <div className="w-full flex items-center justify-between">
        <Image
          width={120}
          height={120}
          className="rounded-full translate-x-8 translate-y-[8px] absolute ring-[6px] ring-white w-[120px] h-[120px]"
          alt=""
          src={data?.photoURL}
        />
      </div>
      <div className="w-full flex items-center justify-between p-4 px-6 ">
        <h1></h1>
        <div className="icon">
        <FlagIcon onClick={() => {
            if(typeof window !== "undefined") {
                alert(`${data?.email} has been reported`);
            }
        }} className="w-6 h-6 text-neutral-400"/>
        </div>
      </div>
      <div className="w-full flex flex-col p-8 py-4">
        <h1 className="text-xl font-[700]">{data?.name}</h1>
        <h1 className="text-sm text-neutral-400">@{data?.username}</h1>
        <p>{data?.createdAt}</p>
      </div>
    </div>
  );
}

export default Page;
