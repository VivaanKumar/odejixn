"use client";

import Head from "@/components/Head";
import Image from "next/image";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChatBubbleOvalLeftIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import Button from "@/components/Button";
import { createContext, useContext, useEffect, useState } from "react";
import Review from "@/components/Review";
import useSWR from "swr";
import Post from "@/components/Post";
import Loading from "@/components/Loading";
import { RootContext } from "@/app/layout";
import { useParams, useRouter } from "next/navigation";
import Comment from "@/components/Comment";

const fetcher = (url: any) => fetch(url).then((r) => r.json());
const PageContext = createContext<any>("");

// import { useRouter } from "next/router";

export default function Home() {
  const [user, setUser] = useContext(RootContext).user;
  const params: any = useParams()?.id;
  // const id = useRouter().query;

  const router = useRouter();

  const { data, error, isLoading } = useSWR(
    typeof window !== "undefined" ? `/api/getPost?id=${params}` : ``,
    fetcher,
    { refreshInterval: 1000, dedupingInterval: 1000 }
  );
  const [post, setPost] = useState<any>(null);

  const [updateLike, setUpdateLike] = useState<number>();

  useEffect(() => {
    console.log(data);
    if (data) {
      setPost(data);
    }
  }, [data]);

  return (
    <>
      <Head
        label={
          <>
            <div className="flex w-full p-4 h-14">
              <div className="text-xl translate-x-[-8px] w-full flex space-x-2 items-center">
                <div onClick={() => router.push("/")} className="icon">
                  <ArrowLeftIcon className="w-6 h-6" />
                </div>
                <h1>{post?.title.substring(0, 12) || "Post"}</h1>
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

      {post && <Post id={params} email={post?.email} />}

      {!post && <Loading/>}

      {post && <div className="w-full py-2 flex space-x-4 border-b items-center border-neutral-200">
        <div className="w-2 h-12 bg-primary rounded-xl rounded-l-none"></div>
        <div className="icon hover:bg-violet-100 w-10 h-10">
          <ChatBubbleOvalLeftIcon className="w-6 h-6 text-violet-600" />
        </div>
        <div className="flex flex-col justify-center">
          <h1>Review Comments</h1>
          <p className="text-[12px] text-neutral-600">Write your comment</p>
        </div>
      </div>}

      {post?.comments?.map((c: any) => (
        <Comment key={c?._id || Math.floor(Math.random() * 1000000)} email={c?.email} caption={c?.caption} />
      ))}
    </>
  );
}
