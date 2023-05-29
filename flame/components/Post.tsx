"use client";

import React, { ContextType, useContext, useEffect, useState } from "react";
import useSWR from "swr";
import { CalendarIcon, EyeIcon, StarIcon } from "@heroicons/react/24/solid";
import {
  ArrowPathIcon,
  ArrowPathRoundedSquareIcon,
  ChatBubbleOvalLeftIcon,
  CursorArrowRippleIcon,
  EllipsisHorizontalCircleIcon,
  EllipsisHorizontalIcon,
  FaceSmileIcon,
  FlagIcon,
  HandThumbUpIcon,
  HeartIcon,
  MegaphoneIcon,
  ShareIcon,
  StarIcon as StarIconO,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Moment from "react-moment";
import FileType from "./FileType";
import { HeartIcon as HeartIconB } from "@heroicons/react/24/solid";
import { RootContext } from "@/app/layout";
import { FadeIn } from "react-slide-fade-in";
import { toast } from "react-hot-toast";

type Props = {
  id: string;
  email: string;
};

const fetcher = (url: any) => fetch(url).then((res) => res.json());

function Post({ id, email }: Props) {
  const { data, error, isLoading } = useSWR(
    typeof window !== "undefined" ? `/api/getPost?id=${id}` : ``,
    fetcher,
    { refreshInterval: 1000, dedupingInterval: 1000 }
  );
  const { data: ownUser } = useSWR(`/api/getUser?email=${email}`, fetcher);

  const [post, setPost] = useState<any>(null);
  const [user_, setUser_] = useState<any>(null);
  const [user, setUser] = useContext<any>(RootContext).user;
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [dataU, setDataU] = useState<any>();
  const [commentModal, setCommentModal] = useContext(RootContext).commentModal;

  async function fetchView(data: any) {
    const data_ = await fetch(
      `/api/viewPost?email=${user?.email}&id=${data?._id}`
    );

    return data_.json();
  }

  useEffect(() => {
    if (!data) return;
    if ((data?.likes as string[]).includes(user?.email)) {
      setHasLiked(true);
    } else {
      setHasLiked(false);
    }
  }, [data?.likes]);

  useEffect(() => {
    setUser_(ownUser);
  }, [ownUser]);
  useEffect(() => {
    setDataU(data);

    const fetchTheView = async () => {
      const addedView = await fetchView(data);

      console.log(addedView);
    };

    if (data && user) {
      if (((data?.views as string[]) || []).includes(user?.email)) {
        console.log("Aready added view");
      } else {
        fetchTheView();
      }
    }
  }, [data]);
  const router = useRouter();

  if (!data || !user_) return <></>;

  async function fetchLike() {
    const res = await fetch(`/api/likePost`, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      body: JSON.stringify({
        id: data?._id,
        email: user?.email,
      }),
    });

    return res.json();
  }

  // <div className="icon hover:bg-sky-100 p-2 px-2  py-2  w-fit h-fit">
  //                 <FaceSmileIcon className="w-6 h-6 text-sky-400" />
  //               </div>
  //               <div className="icon hover:bg-sky-100 p-2 px-2  py-2  w-fit h-fit">
  //                 <VideoCameraIcon className="w-6 h-6 text-sky-400" />
  //               </div>
  //               <div className="icon hover:bg-sky-100 p-2 px-2  py-2  w-fit h-fit">
  //                 <PhotoIcon className="w-6 h-6 text-sky-400" />
  //               </div>
  //               <div className="icon hover:bg-sky-100 p-2 px-2  py-2  w-fit h-fit">
  //                 <MicrophoneIcon className="w-6 h-6 text-sky-400" />
  //               </div>
  //               <div className="icon hover:bg-sky-100 p-2 px-2  py-2  w-fit h-fit">
  //                 <MapPinIcon className="w-6 h-6 text-sky-400" />
  //               </div>

  return (
    <div
      onClick={() => router.push(`/review/${data?._id}`)}
      className="w-[100%] flex space-x-4 border-b border-neutral-200 p-4 transition-colors ease-in-out duration-200 hover:bg-neutral-100 cursor-pointer"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/user/${user?.email}`);
        }}
        className="flex flex-col space-y-4 items-center"
      >
        {/* <Avatar width={50} src={user?.photoURL} /> */}
        <Image
          className="rounded-full"
          src={user_?.photoURL as string}
          height={50}
          width={50}
          alt="User Image"
        />
      </div>
      <div className="w-[100%] flex flex-col space-y-4">
        <div className="w-[100%] flex items-center justify-between">
          <div className="flex flex-col items-start">
            <div className="flex space-x-2 justify-center">
              <h1 className="font-[700]">{user_?.name}</h1>
              <p className="text-sm text-neutral-600">
                @{user_?.username?.toLowerCase()?.substring(0, 10)}...
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <p className="text-sm flex space-x-2 items-center text-neutral-600">
                <CalendarIcon className="w-4 h-4" />
                <span>
                  <Moment fromNow interval={1000}>
                    {data?.createdAt}
                  </Moment>
                </span>
              </p>
              <p className="text-sm flex space-x-2 items-center text-neutral-600">
                <EyeIcon className="w-4 h-4" />
                <span>{dataU?.views?.length || 0} views</span>
              </p>
            </div>
          </div>
          <div className="flex items-end flex-col-reverse space-y-3">
            <div className="flex  select-none hoverButton hover:ring-2 hover:ring-amber-600 cursor-pointer space-x-2 h-[30px] items-center bg-amber-100 rounded-full px-3 p-1 transition duration-200 ease-in-out">
              <StarIcon className="w-5 h-5 text-amber-400" />
              <p className="text-[16px] text-amber-400">{data?.rated}</p>
            </div>
          </div>
        </div>
        <div className="w-[100%] flex flex-col space-y-4">
          <h1 className="">
            <span className="fontBold">{data?.title?.toUpperCase()}</span>
          </h1>
          <p className="text-neutral-600 translate-y-[]">{data?.desc}</p>
          {data?.type && data?.fileURL && (
            <FileType type={data?.type} url={data?.fileURL} />
          )}
        </div>
        <div className="flex space-x-2 items-center w-full justify-between">
          <div className="flex items-center text-neutral-600">
            <div
              onClick={async (e: any) => {
                e.stopPropagation();

                const data__ = await fetchLike();

                let toChangeData = data;

                if (data__) {
                  if (data__.liked == true) {
                    setHasLiked(true);

                    // console.log(toChangeData);

                    toChangeData.likes.push(user?.email);

                    setDataU(toChangeData);
                  } else {
                    setHasLiked(false);

                    toChangeData.likes = toChangeData.likes.filter(
                      (a: any) => a !== user?.email
                    );
                    // toChangeData = toChangeData.filter((a: any) => a !== user?.email)

                    setDataU(toChangeData);
                  }
                }
              }}
              className="icon items-center p-2 px-2 py-2 w-fit h-fit hover:bg-violet-100 iconSvg"
            >
              {!hasLiked ? (
                <HeartIcon className="w-6 h-6 text-violet-500" />
              ) : (
                <HeartIconB className="w-6 h-6 text-violet-500" />
              )}
            </div>
            <p className="text-[15px]">{dataU?.likes?.length}</p>
          </div>
          <div className="flex items-center text-neutral-600">
            <div className="icon p-2 px-2  py-2  w-fit h-fit text-violet-500 hover:bg-violet-100 iconSvg">
              <ChatBubbleOvalLeftIcon
                onClick={(e: any) => {
                  e.stopPropagation();
                  setCommentModal({
                    id,
                    user: ownUser,
                  });
                }}
                className="w-6 h-6"
              />
            </div>
            <p className="text-[15px]">{dataU?.comments?.length || 0}</p>
          </div>
          <div className="flex items-center text-neutral-600">
            <div className="icon p-2 px-2  py-2  w-fit h-fit text-violet-500 hover:bg-violet-100 iconSvg">
              <MegaphoneIcon onClick={() => {
                 toast("This post has been reported", {
                  icon: <XMarkIcon className="w-6 h-6 text-white" />,
                  style: {
                    borderRadius: "100px",
                    background: "#8544ef",
                    color: "#fff",
                  },
                });
              }} className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center text-neutral-600">
            <div className="icon p-2 px-2  py-2  w-fit h-fit text-violet-500 hover:bg-violet-100 iconSvg">
              <ShareIcon onClick={(() => {
                if(typeof window !== "undefined") {
                  window.open(`https://web.whatsapp.com://send?text= ${window.location.href}`); 
                }
              })} className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
