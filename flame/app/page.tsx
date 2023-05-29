"use client";

import Head from "@/components/Head";
import Image from "next/image";
import {
  MagnifyingGlassIcon,
  SparklesIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Button from "@/components/Button";
import { useContext, useEffect, useState } from "react";
import { RootContext, User } from "./layout";
import Review from "@/components/Review";
import useSWR from "swr";
import Post from "@/components/Post";
import Loading from "@/components/Loading";
import { toast } from "react-hot-toast";

const fetcher = (url: any) => fetch(url).then((r) => r.json());

export default function Home() {
  const [user, setUser] = useContext(RootContext).user;
  const [search, setSearch] = useState<string>();
  const [type, setType] = useState<any>("recent");
  const { data, error, isLoading, mutate } = useSWR(
    typeof window !== "undefined"
      ? `/api/getAllPosts?limit=${10}&type=${type}&search=${search}`
      : ``,
    fetcher
  );
  const [posts, setPosts] = useState<any>([]);

  useEffect(() => {
    if (data && Object.keys(data).length !== 0) {
      setPosts(data);
      console.log(data);
    }
  }, [data]);

  return (
    <>
      <Head
        label={
          <>
            <div className="flex w-full p-4 h-14">
              <div className="w-full flex items-center justify-between">
                <div className="flex flex-col translate-y-2">
                  <h1 className="text-[18px] leading-4">Lavendar Reviews</h1>
                  <p className="text-[12px] text-neutral-600">
                    Better than Google Reviews
                  </p>
                </div>
                <div className="icon  translate-x-2">
                  <MagnifyingGlassIcon
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        const searchInput = prompt(
                          "Search a review or keyword:"
                        );
                        if (!searchInput?.trim()) {
                          toast("Please enter a proper search word", {
                            icon: <XMarkIcon className="w-6 h-6 text-white" />,
                            style: {
                              borderRadius: "100px",
                              background: "#8544ef",
                              color: "#fff",
                            },
                          });
                        } else {
                          setSearch(searchInput);
                          mutate();
                          setPosts([]);
                        }
                      }
                    }}
                    className="w-6 h-6"
                  />
                </div>
              </div>
            </div>
            <div className="flex w-full text-[16px]">
              <p
                onClick={() => {
                  setType("recent");
                  setPosts([]);
                  mutate();
                }}
                className="w-[50%] hoverAnimation h-12 flex justify-center items-center cursor-pointer hover:bg-neutral-200"
              >
                Recent
              </p>
              <p
                onClick={() => {
                  setType("popular");
                  setPosts([]);
                  mutate();
                }}
                className="w-[50%] hoverAnimation h-12 flex justify-center items-center cursor-pointer hover:bg-neutral-200"
              >
                Popular
              </p>
              <div
                style={{
                  transform: `translate(${
                    type == "recent" ? 28 * 4 : 103 * 4
                  }px, ${42}px)`,
                }}
                className="absolute ease-in-out transition duration-200 h-[6px] w-[75px] from-primary to-secondary bg-gradient-to-r rounded-t-xl"
              ></div>
            </div>
          </>
        }
      />
      <div className="h-[105px]"></div>
      {!user ? (
        <div className="w-full flex justify-center p-4 border-b border-neutral-200">
          {<Button />}
        </div>
      ) : (
        <div className="p-4 border-b border-neutral-200">
          <Review />
        </div>
      )}

      {posts?.length !== 0 ? (
        <div>
          {posts.length &&
            posts?.map((p: any) => (
              <Post id={p?._id} key={p?._id} email={p?.email} />
            ))}
        </div>
      ) : (
        <div className="w-full justify-center items-center mt-4">
          <Loading />
        </div>
      )}
    </>
  );
}
