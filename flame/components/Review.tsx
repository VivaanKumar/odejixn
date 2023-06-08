"use client";

import React, { useContext, useId, useRef, useState } from "react";
// import Avatar from "../Avatar";
import { RootContext, User } from "@/app/layout";
import {
  FaceSmileIcon,
  MapPinIcon,
  MicrophoneIcon,
  VideoCameraIcon,
  PaperClipIcon,
  PhotoIcon,
  StarIcon as StarIconO,
  ChevronDownIcon,
  EllipsisHorizontalCircleIcon,
  EllipsisVerticalIcon,
  EllipsisHorizontalIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import { StarIcon, EyeIcon, XMarkIcon } from "@heroicons/react/24/solid";
// import { toast } from "react-hot-toast";
// import { useIsomorphicLayoutEffect } from "swr/_internal";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FileOptions } from "buffer";
import { getDownloadURL, uploadBytes } from "firebase/storage";
import { ref, storage } from "../firebase";
// import { FaChessBishop, FaEye, FaPaperPlane, FaPaperclip, FaRegEye, FaRegMap, FaRegSmile, FaStar } from "react-icons/fa";
const { v4: uuidv4 } = require("uuid");

// import { FiMapPin, FiPaperclip, FiSmile } from "react-icons/fi"

type Props = {};

function Review({ mutate }: any) {
  const [rated, setRated] = useState<number>(1);
  const [title, setTitle] = useState<string>("");
  const [desc, setDesc] = useState<string>("");

  const inputId = useId();

  const [user, setUser] = useContext(RootContext).user;
  const [file, setFile] = useState<any>(null);

  const [postModal, setPostModal] = useContext(RootContext).postModal;

  const inputChange = (e: any) => {
    const fileSelected = e.target.files[0];
    if (fileSelected) {
      console.log(fileSelected);
      const selectedImageSrc = URL.createObjectURL(e.target.files[0]);
      const sizeMB = fileSelected?.size / 1_000_000;

      if (sizeMB > 50) {
        toast("File must be less than 50mb", {
          icon: <XMarkIcon className="w-6 h-6 text-white" />,
          style: {
            borderRadius: "100px",
            background: "#8544ef",
            color: "#fff",
          },
        });
      } else {
        setFile(fileSelected);
      }
      // console.log(e.target.files[0]);
      // const type = e.target.files[0].type;
      // if (type.includes("image")) {
      //   const imagePreview = document.getElementById("image-preview");
      //   const videoPreview = document.getElementById("video-preview");
      //   console.log(document.getElementById("image-preview"));
      //   console.log(imagePreview, videoPreview);
      //   videoPreview.style.display = "none";
      //   imagePreview.src = selectedImageSrc;
      //   imagePreview.style.display = "block";
      //   setImage(e.target.files[0]);
      // } else if (type.includes("video")) {
      //   const imagePreview = document.getElementById("image-preview");
      //   const videoPreview = document.getElementById("video-preview");
      //   imagePreview.style.display = "none";
      //   videoPreview.src = selectedImageSrc;
      //   videoPreview.style.display = "block";
      //   setImage(e.target.files[0]);
      // } else {
      //   alert("This file type is not supported :(");
      // }
    }
  };

  const router = useRouter();

  async function fetchPost(url: string) {
    const res = await fetch(`/api/createPost`, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      body: JSON.stringify({
        rated,
        title,
        desc,
        email: user?.email,
        url: url,
        type: file?.type || "unknown",
      }),
    });

    return res.json();
  }

  // ?rated=${rated}&title=${title}&desc=${desc}&email=${user?.email}&url=` + (url)

  const click = async () => {

    toast.loading("Creating post");
    if (file) {
      const id_ = uuidv4();

      const storageRef = ref(storage, `images/${id_}-${file?.name}}`);
      let url_;

      uploadBytes(storageRef, file).then(async (snap) => {
        getDownloadURL(storageRef).then(async (url) => {
          console.log(url);
          const data = await fetchPost(url);
          if (data) {
            // console.log(data)
            // call mutate
            setPostModal(false);
            toast.dismiss();
            toast.success("Added post")
            router.push(`/review/${data?._id}`);
          }
        });
      });

      // console.log(url_);
    } else {
      //
      const data = await fetchPost("");
      if (data) {
        // console.log(data)
        // call mutate
        toast.dismiss();
            toast.success("Added post")
        setPostModal(false);
        router.push(`/review/${data?._id}`);
      }
    }
  };
  return (
    <div className="w-[100%] h-[100%]">
      <div className="w-[100%] flex justify-between space-x-2">
        <div className="flex space-x-4 w-[100%]">
          <Image
            className="rounded-full w-[50px] h-[50px] aspect-square"
            src={user?.photoURL as string}
            height={50}
            width={50}
            alt="User Image"
          />

          <div className="flex flex-col space-y-4 w-[100%]">
            <div className="w-full space-x-2 justify-between flex">
              <div className="flex space-x-4 items-center">
                <div className="px-3 hoverButton hover:ring-2 p-1 h-[30px] select-none items-center bg-violet-100 cursor-pointer transition duration-200 ease-in-out text-violet-400 rounded-full flex space-x-2">
                  <EyeIcon className="w-6 h-6" />
                  <span className="text-sm font-thin">Everyone</span>
                </div>

                <div
                  onClick={() => setRated(rated !== 5 ? rated + 1 : 1)}
                  className="flex hoverButton hover:ring-2  hover:ring-amber-600 select-none cursor-pointer space-x-2 h-[30px] items-center bg-amber-100 rounded-full px-3 p-1 transition duration-200 ease-in-out"
                >
                  <StarIcon className="w-5 h-5 text-amber-400" />
                  <p className="text-sm text-amber-400">{rated} star</p>
                </div>
              </div>

              {/* <div className="icon px-[6px] py-[px] p-[6px] w-fit h-fit flex items-center justify-center">
                <EllipsisHorizontalIcon className="w-6 h-6 text-neutral-600" />
              </div> */}
            </div>
            <input
              //   onChange={(e) => setTitle(e.target.value)}
              //   value={title}
              className="p-2 w-full outline-none bg-neutral-100 text-black text-center rounded-full px-6"
              placeholder="Write your review title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              //   onChange={(e) => setDesc(e.target.value)}
              //   value={desc}
              className="outline-none flex items-center justify-center rounded-[14px] resize-none p-3 w-[100%] h-[100px]"
              placeholder="Review Description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            ></textarea>

            <div className="w-[100%] space-x-2 flex justify-between items-center">
              <div className="w-[100%] flex items-center space-x-2">
                <div
                  onClick={() => {
                    document.getElementById(inputId)?.click();
                  }}
                  className={`icon hover:bg-violet-100 flex space-x-2 p-2 px-2 py-2 w-fit h-fit ${
                    file && "border-2 border-violet-200"
                  }`}
                >
                  {file && (
                    <div
                      onClick={(e: any) => {
                        e.stopPropagation();
                        (document.getElementById(inputId) as any).value = "";
                        setFile(null);
                      }}
                      className="w-5 grid place-content-center hoverAnimation hover:ring-2 ring-offset-1 an ring-black relative h-5 rounded-full bg-black backdrop-blur-sm text-white"
                    >
                      <TrashIcon className="w-4 h-4 text-white" />
                    </div>
                  )}
                  {file ? (
                    <h1 className="text-sm flex space-x-2 items-center">
                      <PaperClipIcon className="w-5 h-5 text-violet-400" />
                      <span className="text-violet-400">
                        {file?.name.substring(0, 20)}
                      </span>
                    </h1>
                  ) : (
                    <PaperClipIcon className="w-6 h-6 text-violet-400" />
                  )}
                </div>
                <input
                  id={inputId}
                  onChange={inputChange}
                  className="hidden"
                  type="file"
                />
                <div onClick={() => {
                   toast("Coming soon", {
                    icon: <XMarkIcon className="w-6 h-6 text-white" />,
                    style: {
                      borderRadius: "100px",
                      background: "#8544ef",
                      color: "#fff",
                    },
                  });
                }} className="icon hover:bg-violet-100 p-2 px-2  py-2  w-fit h-fit">
                  <FaceSmileIcon className="w-6 h-6 text-violet-400" />
                </div>
                {/* <Picker onSelect={this.addEmoji} /> */}
              </div>
              <button
                onClick={() => click()}
                disabled={!title.trim() || !desc.trim()}
                className={`disabled:opacity-[0.6] disabled:pointer-events-none w-fit hoverButton flex items-center text-xl justify-center from-primary to-secondary bg-gradient-to-r text-white rounded-full p-4 py-2 cursor-pointer hover:bg-primary hover:bg-opacity-80`}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Review;
