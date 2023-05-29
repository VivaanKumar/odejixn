"use client";

import { RootContext } from "@/app/layout";
import { Dialog } from "@headlessui/react";
import React, { useContext } from "react";
import Review from "./Review";

function PostModal() {
    const [postModal, setPostModal] = useContext(RootContext).postModal;

  return (
    <Dialog
      open={postModal}
      onClose={() => setPostModal(false)}
      className="relative z-50"
    >
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        {/* The actual dialog panel  */}
        <Dialog.Panel className="p-6 bg-white w-[600px] h-fit rounded-xl">
          <Dialog.Title className="text-2xl mb-4">Create A Review</Dialog.Title>

          <Review/>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default PostModal;
