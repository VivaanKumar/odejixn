"use client";

import { RootContext } from "@/app/layout";
import { Dialog } from "@headlessui/react";
import React, { useContext, useState } from "react";
import Review from "./Review";
import Image from "next/image";
import { FaceSmileIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

function CommentModal() {
  const [commentModal, setCommentModal] = useContext(RootContext).commentModal;
  const [user, setUser] = useContext(RootContext).user;
  const [caption, setCaption] = useState<string>("");

  const router = useRouter();

  async function fetchLike() {
    const res = await fetch(`/api/commentPost`, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      body: JSON.stringify({
        id: commentModal?.id,
        comment: {
          caption,
          email: user?.email,
        },
      }),
    });

    return res.json();
  }

  const click = async () => {
    const data = await fetchLike();

    console.log(data)

    if(data) {
      setCaption("");
      router.push(`/review/${data?._id}`)
      setCommentModal(null);
    }
  };

  return (
    <Dialog
      open={commentModal ? true : false}
      onClose={() => setCommentModal(null)}
      className="relative z-50"
    >
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        {/* The actual dialog panel  */}
        <Dialog.Panel className="p-6 bg-white w-[600px] h-fit rounded-xl space-y-4">
          <Dialog.Title className="text-xl">Add your comment</Dialog.Title>
          <div className="w-[100%] h-fit flex space-x-4">
            <div className="flex flex-col items-center">
              <Image
                alt="User Photo"
                src={commentModal?.user?.photoURL}
                width={50}
                height={50}
                className="rounded-full ring-2 ring-offset-2 z-10 ring-primary"
              />
              <div className="w-[2px] h-[24px] bg-neutral-200"></div>
              <Image
                alt="User"
                src={user?.photoURL}
                width={50}
                height={50}
                className="rounded-full"
              />
            </div>
            <div className="flex flex-col  w-full">
              <div className="flex space-x-2 items-center h-fit">
                <p className="font-[700]">{commentModal?.user?.name}</p>
                <p className="text-sm text-neutral-600">
                  @{commentModal?.user?.username}
                </p>
              </div>
              <p className="text-neutral-600">
                Reply to {commentModal?.user?.name}s review
              </p>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="rounded-xl border border-neutral-200 px-4 w-[100%] h-[100px] mt-[22px] resize-none outline-none py-2  placeholder:text-neutral-400"
                placeholder="Your comment..."
              ></textarea>
              <div className="flex w-[100%] justify-between mt-4 items-center">
                <div className="flex space-x-2 items-center">
                  <div className="icon hover:bg-violet-50">
                    <FaceSmileIcon className="w-6 h-6 text-primary" />
                  </div>
                  <div onClick={() => {
                    setCaption("");
                  }} className="icon hover:bg-violet-50">
                    <TrashIcon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <button
                  onClick={() => click()}
                  disabled={!caption.trim()}
                  className={`disabled:opacity-[0.6] disabled:pointer-events-none w-fit hoverButton flex items-center text-xl justify-center from-primary to-secondary bg-gradient-to-r text-white rounded-full p-4 py-2 cursor-pointer hover:bg-primary hover:bg-opacity-80`}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default CommentModal;
