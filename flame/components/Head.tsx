"use client";

import React from "react";

type Props = {
  label: React.ReactNode;
};

function Head({ label }: Props) {
  return (
    <div className="w-[600px] z-10 absolute h-fit flex flex-col justify-between items-center backdrop-blur-xl bg-white/60 border-b border-neutral-200">
      {label}
    </div>
  );
}

export default Head;
