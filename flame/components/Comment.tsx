import Image from "next/image";
import React from "react";
import useSWR from "swr";

type Props = {
  caption: string;
  email: string;
};

const fetcher = (url: any) => fetch(url).then((res) => res.json());

function Comment({ caption, email }: Props) {
  const { data: ownUser } = useSWR(`/api/getUser?email=${email}`, fetcher);
  return <div className="w-[100%] flex space-x-4 h-fit p-4 border-b border-neutral-200">
    <Image width={50} height={50} alt="" src={ownUser?.photoURL} className="rounded-full"/>
    <div className="flex flex-col">
        <div className="flex space-x-4 items-center">
          <p className="font-[700]">{ownUser?.name}</p>
          <p className="text-sm text-neutral-600">@{ownUser?.username}</p>
        </div>
        <p>{caption}</p>

    </div>
  </div>;
}

export default Comment;
