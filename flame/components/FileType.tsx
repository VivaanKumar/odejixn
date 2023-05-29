import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  url: String;
  type: String;
};

function FileType({ url, type }: Props) {

    const router = useRouter();
  if (type.includes("image")) {
    return (
      <div className="w-[100%] relative h-[400px] border rounded-xl bg-black">
        <Image
          fill
          className="rounded-xl z-0 object-contain"
          priority
          alt="File Input"
          src={url as string}
        />
      </div>
    );
  }

  if (type.includes("video")) {
    return (
      <div className="w-[100%]">
        <video className="rounded-xl" controls src={url as string}></video>
      </div>
    );
  }

  if (type.includes("audio")) {
    return (
      //   <div className="w-[100%] relative h-[400px] border rounded-xl bg-black">
      <audio className="rounded-full" controls src={url as string}></audio>
      //   </di
    );
  }

    

  return (
    <div  className="p-2 px-4 bg-neutral-200 rounded-full w-fit flex space-x-2">
      <ArrowDownTrayIcon className="w-6 h-6" />
      <a
      
     

        onClick={(e) => {
          e.stopPropagation();
          router.push(url as string);
        }}
      >
        File Attachment
      </a>
    </div>
  );
}

export default FileType;
